import pool from "../config/db";

export type ChatMessage = {
  id: number;
  sender_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  pseudo: string;
  avatar_url: string | null;
};

async function ensureActivityExists(activityId: number) {
  const [activityRows] = await pool.query("SELECT id FROM activities WHERE id = ?", [activityId]);
  const activityList = activityRows as any[];
  if (activityList.length === 0) {
    const err: any = new Error("Activity not found");
    err.status = 404;
    err.code = "ACTIVITY_NOT_FOUND";
    throw err;
  }
}

async function ensureParticipant(userId: number, activityId: number) {
  await ensureActivityExists(activityId);
  const [participantRows] = await pool.query(
    "SELECT status FROM activity_participants WHERE activity_id = ? AND user_id = ? AND status = 'registered'",
    [activityId, userId]
  );
  if ((participantRows as any[]).length === 0) {
    const err: any = new Error("You must join the activity to chat");
    err.status = 403;
    err.code = "NOT_PARTICIPANT";
    throw err;
  }
}

async function getOrCreateActivityConversation(activityId: number) {
  const [rows] = await pool.query("SELECT * FROM conversations WHERE activity_id = ? AND type = 'activity' LIMIT 1", [activityId]);
  const list = rows as any[];
  if (list.length > 0) return list[0];
  const [insertRes] = await pool.query("INSERT INTO conversations (type, activity_id, created_at) VALUES ('activity', ?, NOW())", [
    activityId,
  ]);
  const conversationId = (insertRes as any).insertId as number;
  return { id: conversationId, activity_id: activityId, type: "activity" };
}

async function addConversationParticipant(conversationId: number, userId: number) {
  await pool.query(
    "INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id",
    [conversationId, userId]
  );
}

export async function listActivityMessages(activityId: number, userId: number, limit = 30, beforeId?: number) {
  await ensureParticipant(userId, activityId);
  const sanitizedLimit = Math.max(1, Math.min(limit, 100));
  const conversation = await getOrCreateActivityConversation(activityId);
  await addConversationParticipant(conversation.id, userId);

  const values: any[] = [activityId];
  let beforeSql = "";
  if (typeof beforeId === "number" && !Number.isNaN(beforeId) && beforeId > 0) {
    beforeSql = "AND m.id < ?";
    values.push(beforeId);
  }
  values.push(sanitizedLimit);

  const [rows] = await pool.query(
    `SELECT m.id, m.sender_id, m.content, m.created_at, m.updated_at, u.pseudo, u.avatar_url
     FROM messages m
     JOIN conversations c ON c.id = m.conversation_id
     JOIN users u ON u.id = m.sender_id
     WHERE c.activity_id = ? AND c.type = 'activity' AND m.is_deleted = FALSE AND m.is_approved = TRUE ${beforeSql}
     ORDER BY m.id DESC
     LIMIT ?`,
    values
  );
  const messages = rows as ChatMessage[];
  // reverse to chronological order (oldest first)
  return messages.reverse();
}

export async function sendActivityMessage(activityId: number, userId: number, content: string) {
  await ensureParticipant(userId, activityId);
  const trimmed = content.trim();
  if (!trimmed) {
    const err: any = new Error("Message content cannot be empty");
    err.status = 400;
    err.code = "EMPTY_MESSAGE";
    throw err;
  }
  const conversation = await getOrCreateActivityConversation(activityId);
  await addConversationParticipant(conversation.id, userId);
  const [insertRes] = await pool.query(
    "INSERT INTO messages (conversation_id, sender_id, content, is_deleted, is_approved, created_at, updated_at) VALUES (?, ?, ?, FALSE, TRUE, NOW(), NOW())",
    [conversation.id, userId, trimmed]
  );
  const messageId = (insertRes as any).insertId as number;
  const [rows] = await pool.query(
    `SELECT m.id, m.sender_id, m.content, m.created_at, m.updated_at, u.pseudo, u.avatar_url
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.id = ?`,
    [messageId]
  );
  return (rows as ChatMessage[])[0];
}

export async function reportActivityMessage(activityId: number, messageId: number, reporterId: number, reason: string) {
  await ensureParticipant(reporterId, activityId);
  const [msgRows] = await pool.query(
    `SELECT m.id FROM messages m
     JOIN conversations c ON c.id = m.conversation_id
     WHERE c.activity_id = ? AND c.type = 'activity' AND m.id = ?`,
    [activityId, messageId]
  );
  if ((msgRows as any[]).length === 0) {
    const err: any = new Error("Message not found for this activity");
    err.status = 404;
    err.code = "MESSAGE_NOT_FOUND";
    throw err;
  }

  const [existingRows] = await pool.query(
    "SELECT id FROM content_reports WHERE target_type = 'message' AND target_id = ? AND reporter_id = ?",
    [messageId, reporterId]
  );
  if ((existingRows as any[]).length > 0) {
    const err: any = new Error("You already reported this message");
    err.status = 409;
    err.code = "REPORT_ALREADY_EXISTS";
    throw err;
  }

  await pool.query(
    "INSERT INTO content_reports (target_type, target_id, reporter_id, reason, status, created_at) VALUES ('message', ?, ?, ?, 'open', NOW())",
    [messageId, reporterId, reason.trim()]
  );
  await pool.query("UPDATE messages SET is_approved = FALSE WHERE id = ?", [messageId]);
  return true;
}

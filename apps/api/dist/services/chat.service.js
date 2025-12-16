"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActivityMessages = listActivityMessages;
exports.sendActivityMessage = sendActivityMessage;
exports.reportActivityMessage = reportActivityMessage;
const db_1 = __importDefault(require("../config/db"));
async function ensureActivityExists(activityId) {
    const [activityRows] = await db_1.default.query("SELECT id FROM activities WHERE id = ?", [activityId]);
    const activityList = activityRows;
    if (activityList.length === 0) {
        const err = new Error("Activity not found");
        err.status = 404;
        err.code = "ACTIVITY_NOT_FOUND";
        throw err;
    }
}
async function ensureParticipant(userId, activityId) {
    await ensureActivityExists(activityId);
    const [participantRows] = await db_1.default.query("SELECT status FROM activity_participants WHERE activity_id = ? AND user_id = ? AND status = 'registered'", [activityId, userId]);
    if (participantRows.length === 0) {
        const err = new Error("You must join the activity to chat");
        err.status = 403;
        err.code = "NOT_PARTICIPANT";
        throw err;
    }
}
async function getOrCreateActivityConversation(activityId) {
    const [rows] = await db_1.default.query("SELECT * FROM conversations WHERE activity_id = ? AND type = 'activity' LIMIT 1", [activityId]);
    const list = rows;
    if (list.length > 0)
        return list[0];
    const [insertRes] = await db_1.default.query("INSERT INTO conversations (type, activity_id, created_at) VALUES ('activity', ?, NOW())", [
        activityId,
    ]);
    const conversationId = insertRes.insertId;
    return { id: conversationId, activity_id: activityId, type: "activity" };
}
async function addConversationParticipant(conversationId, userId) {
    await db_1.default.query("INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id", [conversationId, userId]);
}
async function listActivityMessages(activityId, userId, limit = 30, beforeId) {
    await ensureParticipant(userId, activityId);
    const sanitizedLimit = Math.max(1, Math.min(limit, 100));
    const conversation = await getOrCreateActivityConversation(activityId);
    await addConversationParticipant(conversation.id, userId);
    const values = [activityId];
    let beforeSql = "";
    if (typeof beforeId === "number" && !Number.isNaN(beforeId) && beforeId > 0) {
        beforeSql = "AND m.id < ?";
        values.push(beforeId);
    }
    values.push(sanitizedLimit);
    const [rows] = await db_1.default.query(`SELECT m.id, m.sender_id, m.content, m.created_at, m.updated_at, u.pseudo, u.avatar_url
     FROM messages m
     JOIN conversations c ON c.id = m.conversation_id
     JOIN users u ON u.id = m.sender_id
     WHERE c.activity_id = ? AND c.type = 'activity' AND m.is_deleted = FALSE AND m.is_approved = TRUE ${beforeSql}
     ORDER BY m.id DESC
     LIMIT ?`, values);
    const messages = rows;
    // reverse to chronological order (oldest first)
    return messages.reverse();
}
async function sendActivityMessage(activityId, userId, content) {
    await ensureParticipant(userId, activityId);
    const trimmed = content.trim();
    if (!trimmed) {
        const err = new Error("Message content cannot be empty");
        err.status = 400;
        err.code = "EMPTY_MESSAGE";
        throw err;
    }
    const conversation = await getOrCreateActivityConversation(activityId);
    await addConversationParticipant(conversation.id, userId);
    const [insertRes] = await db_1.default.query("INSERT INTO messages (conversation_id, sender_id, content, is_deleted, is_approved, created_at, updated_at) VALUES (?, ?, ?, FALSE, TRUE, NOW(), NOW())", [conversation.id, userId, trimmed]);
    const messageId = insertRes.insertId;
    const [rows] = await db_1.default.query(`SELECT m.id, m.sender_id, m.content, m.created_at, m.updated_at, u.pseudo, u.avatar_url
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.id = ?`, [messageId]);
    return rows[0];
}
async function reportActivityMessage(activityId, messageId, reporterId, reason) {
    await ensureParticipant(reporterId, activityId);
    const [msgRows] = await db_1.default.query(`SELECT m.id FROM messages m
     JOIN conversations c ON c.id = m.conversation_id
     WHERE c.activity_id = ? AND c.type = 'activity' AND m.id = ?`, [activityId, messageId]);
    if (msgRows.length === 0) {
        const err = new Error("Message not found for this activity");
        err.status = 404;
        err.code = "MESSAGE_NOT_FOUND";
        throw err;
    }
    const [existingRows] = await db_1.default.query("SELECT id FROM content_reports WHERE target_type = 'message' AND target_id = ? AND reporter_id = ?", [messageId, reporterId]);
    if (existingRows.length > 0) {
        const err = new Error("You already reported this message");
        err.status = 409;
        err.code = "REPORT_ALREADY_EXISTS";
        throw err;
    }
    await db_1.default.query("INSERT INTO content_reports (target_type, target_id, reporter_id, reason, status, created_at) VALUES ('message', ?, ?, ?, 'open', NOW())", [messageId, reporterId, reason.trim()]);
    await db_1.default.query("UPDATE messages SET is_approved = FALSE WHERE id = ?", [messageId]);
    return true;
}

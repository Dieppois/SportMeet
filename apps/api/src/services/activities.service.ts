import pool from "../config/db";

export type CreateActivityInput = {
  group_id: number;
  sport_id: number;
  title: string;
  description?: string | null;
  start_at: string; // ISO datetime
  end_at?: string | null;
  location: string;
  level: "debutant" | "intermediaire" | "expert";
  max_participants?: number | null;
};

export async function createActivity(userId: number, data: CreateActivityInput) {
  const [res] = await pool.query(
    "INSERT INTO activities (group_id, sport_id, title, description, start_at, end_at, location, level, max_participants, status, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?, 'published', ?, NOW(), NOW())",
    [
      data.group_id,
      data.sport_id,
      data.title,
      data.description || null,
      data.start_at,
      data.end_at || null,
      data.location,
      data.level,
      data.max_participants || null,
      userId,
    ]
  );
  const id = (res as any).insertId as number;
  // organizer auto-register
  await pool.query(
    "INSERT INTO activity_participants (activity_id, user_id, status, registered_at) VALUES (?,?, 'registered', NOW()) ON DUPLICATE KEY UPDATE status='registered', cancelled_at = NULL",
    [id, userId]
  );
  return getActivityById(id);
}

export async function getActivityById(id: number) {
  const [rows] = await pool.query(
    `SELECT a.*, s.name as sport_name, g.name as group_name,
      (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.id AND ap.status='registered') as registered_count
     FROM activities a
     JOIN sports s ON s.id = a.sport_id
     JOIN groups g ON g.id = a.group_id
     WHERE a.id = ?`,
    [id]
  );
  const list = rows as any[];
  return list[0] || null;
}

export async function updateActivity(userId: number, id: number, data: Partial<CreateActivityInput>) {
  // only creator can update
  const [rows] = await pool.query("SELECT created_by FROM activities WHERE id = ?", [id]);
  const list = rows as any[];
  if (list.length === 0) {
    const err: any = new Error("Activity not found"); err.status = 404; err.code = "ACTIVITY_NOT_FOUND"; throw err;
  }
  if (list[0].created_by !== userId) { const err: any = new Error("Forbidden"); err.status = 403; err.code = "FORBIDDEN"; throw err; }

  const fields: string[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(data)) { fields.push(`${k} = ?`); values.push(v); }
  if (fields.length === 0) return getActivityById(id);
  values.push(id);
  await pool.query(`UPDATE activities SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`, values);
  return getActivityById(id);
}

export async function deleteActivity(userId: number, id: number) {
  const [rows] = await pool.query("SELECT created_by FROM activities WHERE id = ?", [id]);
  const list = rows as any[];
  if (list.length === 0) return true;
  if (list[0].created_by !== userId) { const err: any = new Error("Forbidden"); err.status = 403; err.code = "FORBIDDEN"; throw err; }
  await pool.query("DELETE FROM activities WHERE id = ?", [id]);
  return true;
}

export async function cancelActivity(userId: number, id: number) {
  const [rows] = await pool.query("SELECT created_by FROM activities WHERE id = ?", [id]);
  const list = rows as any[];
  if (list.length === 0) { const err: any = new Error("Activity not found"); err.status = 404; err.code = "ACTIVITY_NOT_FOUND"; throw err; }
  if (list[0].created_by !== userId) { const err: any = new Error("Forbidden"); err.status = 403; err.code = "FORBIDDEN"; throw err; }
  await pool.query("UPDATE activities SET status='cancelled', cancelled_at = NOW(), updated_at = NOW() WHERE id = ?", [id]);
  return getActivityById(id);
}

export async function enroll(userId: number, activityId: number) {
  // check capacity
  const [rows] = await pool.query("SELECT max_participants, status FROM activities WHERE id = ?", [activityId]);
  const list = rows as any[];
  if (list.length === 0) { const err: any = new Error("Activity not found"); err.status = 404; err.code = "ACTIVITY_NOT_FOUND"; throw err; }
  if (list[0].status !== 'published') { const err: any = new Error("Activity not open"); err.status = 400; err.code = "NOT_OPEN"; throw err; }
  const max = list[0].max_participants as number | null;
  if (max) {
    const [countRows] = await pool.query(
      "SELECT COUNT(*) as c FROM activity_participants WHERE activity_id = ? AND status='registered'",
      [activityId]
    );
    const c = (countRows as any[])[0].c as number;
    if (c >= max) { const err: any = new Error("Activity full"); err.status = 400; err.code = "ACTIVITY_FULL"; throw err; }
  }
  await pool.query(
    "INSERT INTO activity_participants (activity_id, user_id, status, registered_at) VALUES (?,?, 'registered', NOW()) ON DUPLICATE KEY UPDATE status='registered', registered_at = NOW(), cancelled_at = NULL",
    [activityId, userId]
  );
  return true;
}

export async function unenroll(userId: number, activityId: number) {
  await pool.query(
    "UPDATE activity_participants SET status='cancelled', cancelled_at = NOW() WHERE activity_id = ? AND user_id = ? AND status='registered'",
    [activityId, userId]
  );
  return true;
}

export async function getActivityParticipants(activityId: number) {
  const [rows] = await pool.query(
    "SELECT ap.user_id as id, u.pseudo, u.avatar_url FROM activity_participants ap JOIN users u ON u.id = ap.user_id WHERE ap.activity_id = ? AND ap.status='registered' ORDER BY u.pseudo",
    [activityId]
  );
  return rows as any[];
}

export async function remainingSpots(activityId: number) {
  const [rows] = await pool.query("SELECT max_participants FROM activities WHERE id = ?", [activityId]);
  const list = rows as any[];
  if (list.length === 0) return null;
  const max = list[0].max_participants as number | null;
  const [countRows] = await pool.query(
    "SELECT COUNT(*) as c FROM activity_participants WHERE activity_id = ? AND status='registered'",
    [activityId]
  );
  const c = (countRows as any[])[0].c as number;
  return max ? Math.max(0, max - c) : null;
}

export async function rateOrganizer(activityId: number, raterUserId: number, score: number, comment?: string | null) {
  // find organizer (created_by)
  const [rows] = await pool.query("SELECT created_by FROM activities WHERE id = ?", [activityId]);
  const list = rows as any[];
  if (list.length === 0) { const err: any = new Error("Activity not found"); err.status=404; err.code="ACTIVITY_NOT_FOUND"; throw err; }
  const organizerId = list[0].created_by as number;
  await pool.query(
    "INSERT INTO activity_ratings (activity_id, rated_user_id, rater_user_id, score, comment, created_at) VALUES (?,?,?,?,?, NOW()) ON DUPLICATE KEY UPDATE score=VALUES(score), comment=VALUES(comment)",
    [activityId, organizerId, raterUserId, score, comment || null]
  );
  return true;
}

export async function listGroupActivities(groupId: number) {
  const [rows] = await pool.query(
    `SELECT a.*, (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.id AND ap.status='registered') as registered_count
     FROM activities a WHERE a.group_id = ? ORDER BY a.start_at DESC LIMIT 100`,
    [groupId]
  );
  return rows as any[];
}

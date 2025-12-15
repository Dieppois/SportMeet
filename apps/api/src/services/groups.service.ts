import pool from "../config/db";

export type CreateGroupInput = {
  name: string;
  description?: string | null;
  city: string;
  sport_id: number;
  level: "debutant" | "intermediaire" | "expert";
  visibility?: "public" | "private";
  max_members?: number | null;
};

export async function createGroup(userId: number, data: CreateGroupInput) {
  const [res] = await pool.query(
    "INSERT INTO groups (name, description, city, sport_id, level, visibility, max_members, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?, ?, NOW(), NOW())",
    [
      data.name,
      data.description || null,
      data.city,
      data.sport_id,
      data.level,
      data.visibility || "public",
      data.max_members || null,
      userId,
    ]
  );
  const insertId = (res as any).insertId as number;
  // owner becomes member with role owner
  await pool.query(
    "INSERT INTO group_members (group_id, user_id, role, status, joined_at) VALUES (?,?,?,?, NOW())",
    [insertId, userId, "owner", "active"]
  );
  return getGroupById(insertId);
}

export async function getGroupById(groupId: number) {
  const [rows] = await pool.query(
    "SELECT g.*, s.name as sport_name FROM groups g JOIN sports s ON g.sport_id = s.id WHERE g.id = ?",
    [groupId]
  );
  const list = rows as any[];
  return list[0] || null;
}

export async function searchGroups(params: { sport_id?: number; level?: string; city?: string }) {
  const where: string[] = [];
  const values: any[] = [];
  if (params.sport_id) {
    where.push("g.sport_id = ?");
    values.push(params.sport_id);
  }
  if (params.level) {
    where.push("g.level = ?");
    values.push(params.level);
  }
  if (params.city) {
    where.push("g.city = ?");
    values.push(params.city);
  }
  const sql = `SELECT g.*, s.name as sport_name, (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id AND gm.status='active') as members_count FROM groups g JOIN sports s ON g.sport_id = s.id ${
    where.length ? "WHERE " + where.join(" AND ") : ""
  } ORDER BY g.created_at DESC LIMIT 50`;
  const [rows] = await pool.query(sql, values);
  return rows as any[];
}

export async function joinGroup(userId: number, groupId: number) {
  // check capacity if max_members
  const [rows] = await pool.query(
    "SELECT max_members FROM groups WHERE id = ?",
    [groupId]
  );
  const list = rows as any[];
  if (list.length === 0) {
    const err: any = new Error("Group not found");
    err.status = 404; err.code = "GROUP_NOT_FOUND"; throw err;
  }
  const max = list[0].max_members as number | null;
  if (max) {
    const [countRows] = await pool.query(
      "SELECT COUNT(*) as c FROM group_members WHERE group_id = ? AND status='active'",
      [groupId]
    );
    const c = (countRows as any[])[0].c as number;
    if (c >= max) {
      const err: any = new Error("Group is full");
      err.status = 400; err.code = "GROUP_FULL"; throw err;
    }
  }
  await pool.query(
    "INSERT INTO group_members (group_id, user_id, role, status, joined_at) VALUES (?,?, 'member','active', NOW()) ON DUPLICATE KEY UPDATE status='active', left_at = NULL",
    [groupId, userId]
  );
  return true;
}

export async function leaveGroup(userId: number, groupId: number) {
  await pool.query(
    "UPDATE group_members SET status='left', left_at = NOW() WHERE group_id = ? AND user_id = ? AND status='active'",
    [groupId, userId]
  );
  return true;
}

export async function listMembers(groupId: number) {
  const [rows] = await pool.query(
    "SELECT gm.user_id as id, gm.role, u.pseudo, u.avatar_url FROM group_members gm JOIN users u ON u.id = gm.user_id WHERE gm.group_id = ? AND gm.status='active' ORDER BY gm.role desc, u.pseudo",
    [groupId]
  );
  return rows as any[];
}

import pool from "../config/db";

export async function getUserById(id: number) {
  const [rows] = await pool.query(
    "SELECT id, email, pseudo, first_name, last_name, city, bio, avatar_url, profile_visibility, account_status, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  const list = rows as any[];
  return list[0] || null;
}

export async function getPublicProfile(viewerId: number | null, targetId: number) {
  const user = await getUserById(targetId);
  if (!user) return null;
  const visibility = user.profile_visibility as string;
  if (visibility === "public") return user;
  if (visibility === "private" && viewerId !== targetId) {
    return { id: user.id, pseudo: user.pseudo, profile_visibility: user.profile_visibility };
  }
  if (visibility === "groups" && viewerId !== targetId) {
    // check if they share any group
    const [rows] = await pool.query(
      "SELECT 1 FROM group_members gm1 JOIN group_members gm2 ON gm1.group_id = gm2.group_id WHERE gm1.user_id = ? AND gm2.user_id = ? AND gm1.status='active' AND gm2.status='active' LIMIT 1",
      [viewerId, targetId]
    );
    const list = rows as any[];
    if (list.length === 0) {
      return { id: user.id, pseudo: user.pseudo, profile_visibility: user.profile_visibility };
    }
  }
  return user;
}

export type UpdateProfileInput = {
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
};

export async function updateProfile(userId: number, data: UpdateProfileInput) {
  const fields: string[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(data)) {
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return getUserById(userId);
  values.push(userId);
  await pool.query(`UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`, values);
  return getUserById(userId);
}

export async function setProfileVisibility(userId: number, visibility: "public" | "groups" | "private") {
  await pool.query("UPDATE users SET profile_visibility = ?, updated_at = NOW() WHERE id = ?", [visibility, userId]);
  return getUserById(userId);
}

export type SportLevel = { sport_id: number; level: "debutant" | "intermediaire" | "expert" };

export async function setUserSports(userId: number, sports: SportLevel[]) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM user_sports WHERE user_id = ?", [userId]);
    if (sports.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];
      for (const s of sports) {
        placeholders.push("(?,?,?, NOW())");
        values.push(userId, s.sport_id, s.level);
      }
      await conn.query(`INSERT INTO user_sports (user_id, sport_id, level, created_at) VALUES ${placeholders.join(",")}`,
        values);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  return getUserById(userId);
}

export async function deleteAccount(userId: number) {
  await pool.query(
    "UPDATE users SET account_status='deleted', deleted_at = NOW(), updated_at = NOW() WHERE id = ?",
    [userId]
  );
  return true;
}

export async function searchUsersByPseudo(query: string, limit = 10) {
  const [rows] = await pool.query(
    "SELECT id, pseudo, avatar_url, city FROM users WHERE pseudo LIKE ? ORDER BY pseudo LIMIT ?",
    ["%" + query + "%", limit]
  );
  return rows as any[];
}

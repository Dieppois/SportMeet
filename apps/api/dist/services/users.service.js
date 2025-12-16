"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.getPublicProfile = getPublicProfile;
exports.updateProfile = updateProfile;
exports.setProfileVisibility = setProfileVisibility;
exports.setUserSports = setUserSports;
exports.deleteAccount = deleteAccount;
exports.searchUsersByPseudo = searchUsersByPseudo;
const db_1 = __importDefault(require("../config/db"));
async function getUserById(id) {
    const [rows] = await db_1.default.query("SELECT id, email, pseudo, first_name, last_name, city, bio, avatar_url, profile_visibility, account_status, created_at, updated_at FROM users WHERE id = ?", [id]);
    const list = rows;
    return list[0] || null;
}
async function getPublicProfile(viewerId, targetId) {
    const user = await getUserById(targetId);
    if (!user)
        return null;
    const visibility = user.profile_visibility;
    if (visibility === "public")
        return user;
    if (visibility === "private" && viewerId !== targetId) {
        return { id: user.id, pseudo: user.pseudo, profile_visibility: user.profile_visibility };
    }
    if (visibility === "groups" && viewerId !== targetId) {
        // check if they share any group
        const [rows] = await db_1.default.query("SELECT 1 FROM group_members gm1 JOIN group_members gm2 ON gm1.group_id = gm2.group_id WHERE gm1.user_id = ? AND gm2.user_id = ? AND gm1.status='active' AND gm2.status='active' LIMIT 1", [viewerId, targetId]);
        const list = rows;
        if (list.length === 0) {
            return { id: user.id, pseudo: user.pseudo, profile_visibility: user.profile_visibility };
        }
    }
    return user;
}
async function updateProfile(userId, data) {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(data)) {
        fields.push(`${k} = ?`);
        values.push(v);
    }
    if (fields.length === 0)
        return getUserById(userId);
    values.push(userId);
    await db_1.default.query(`UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`, values);
    return getUserById(userId);
}
async function setProfileVisibility(userId, visibility) {
    await db_1.default.query("UPDATE users SET profile_visibility = ?, updated_at = NOW() WHERE id = ?", [visibility, userId]);
    return getUserById(userId);
}
async function setUserSports(userId, sports) {
    const conn = await db_1.default.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query("DELETE FROM user_sports WHERE user_id = ?", [userId]);
        if (sports.length > 0) {
            const values = [];
            const placeholders = [];
            for (const s of sports) {
                placeholders.push("(?,?,?, NOW())");
                values.push(userId, s.sport_id, s.level);
            }
            await conn.query(`INSERT INTO user_sports (user_id, sport_id, level, created_at) VALUES ${placeholders.join(",")}`, values);
        }
        await conn.commit();
    }
    catch (e) {
        await conn.rollback();
        throw e;
    }
    finally {
        conn.release();
    }
    return getUserById(userId);
}
async function deleteAccount(userId) {
    await db_1.default.query("UPDATE users SET account_status='deleted', deleted_at = NOW(), updated_at = NOW() WHERE id = ?", [userId]);
    return true;
}
async function searchUsersByPseudo(query, limit = 10) {
    const [rows] = await db_1.default.query("SELECT id, pseudo, avatar_url, city FROM users WHERE pseudo LIKE ? ORDER BY pseudo LIMIT ?", ["%" + query + "%", limit]);
    return rows;
}

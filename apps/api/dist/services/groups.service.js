"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = createGroup;
exports.getGroupById = getGroupById;
exports.searchGroups = searchGroups;
exports.listUserGroups = listUserGroups;
exports.joinGroup = joinGroup;
exports.leaveGroup = leaveGroup;
exports.listMembers = listMembers;
const db_1 = __importDefault(require("../config/db"));
async function createGroup(userId, data) {
    const [res] = await db_1.default.query("INSERT INTO `groups` (name, description, city, sport_id, level, visibility, max_members, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?, ?, NOW(), NOW())", [
        data.name,
        data.description || null,
        data.city,
        data.sport_id,
        data.level,
        data.visibility || "public",
        data.max_members || null,
        userId,
    ]);
    const insertId = res.insertId;
    // owner becomes member with role owner
    await db_1.default.query("INSERT INTO group_members (group_id, user_id, role, status, joined_at) VALUES (?,?,?,?, NOW())", [insertId, userId, "owner", "active"]);
    return getGroupById(insertId);
}
async function getGroupById(groupId) {
    const [rows] = await db_1.default.query("SELECT g.*, s.name as sport_name FROM `groups` g JOIN sports s ON g.sport_id = s.id WHERE g.id = ?", [groupId]);
    const list = rows;
    return list[0] || null;
}
async function searchGroups(params) {
    const where = [];
    const values = [];
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
    const sql = `SELECT g.*, s.name as sport_name, (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id AND gm.status='active') as members_count FROM \`groups\` g JOIN sports s ON g.sport_id = s.id ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY g.created_at DESC LIMIT 200`;
    const [rows] = await db_1.default.query(sql, values);
    return rows;
}
async function listUserGroups(userId) {
    const [rows] = await db_1.default.query(`SELECT g.*, s.name as sport_name, gm.role,
      (SELECT COUNT(*) FROM group_members gm2 WHERE gm2.group_id = g.id AND gm2.status='active') as members_count
     FROM group_members gm
     JOIN \`groups\` g ON g.id = gm.group_id
     JOIN sports s ON s.id = g.sport_id
     WHERE gm.user_id = ? AND gm.status='active'
     ORDER BY g.created_at DESC
     LIMIT 200`, [userId]);
    return rows;
}
async function joinGroup(userId, groupId) {
    // check capacity if max_members
    const [rows] = await db_1.default.query("SELECT max_members FROM `groups` WHERE id = ?", [groupId]);
    const list = rows;
    if (list.length === 0) {
        const err = new Error("Group not found");
        err.status = 404;
        err.code = "GROUP_NOT_FOUND";
        throw err;
    }
    const max = list[0].max_members;
    if (max) {
        const [countRows] = await db_1.default.query("SELECT COUNT(*) as c FROM group_members WHERE group_id = ? AND status='active'", [groupId]);
        const c = countRows[0].c;
        if (c >= max) {
            const err = new Error("Group is full");
            err.status = 400;
            err.code = "GROUP_FULL";
            throw err;
        }
    }
    await db_1.default.query("INSERT INTO group_members (group_id, user_id, role, status, joined_at) VALUES (?,?, 'member','active', NOW()) ON DUPLICATE KEY UPDATE status='active', left_at = NULL", [groupId, userId]);
    return true;
}
async function leaveGroup(userId, groupId) {
    await db_1.default.query("UPDATE group_members SET status='left', left_at = NOW() WHERE group_id = ? AND user_id = ? AND status='active'", [groupId, userId]);
    return true;
}
async function listMembers(groupId) {
    const [rows] = await db_1.default.query("SELECT gm.user_id as id, gm.role, u.pseudo, u.avatar_url FROM group_members gm JOIN users u ON u.id = gm.user_id WHERE gm.group_id = ? AND gm.status='active' ORDER BY gm.role desc, u.pseudo", [groupId]);
    return rows;
}

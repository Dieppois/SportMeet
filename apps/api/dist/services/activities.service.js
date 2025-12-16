"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivity = createActivity;
exports.getActivityById = getActivityById;
exports.updateActivity = updateActivity;
exports.deleteActivity = deleteActivity;
exports.cancelActivity = cancelActivity;
exports.enroll = enroll;
exports.unenroll = unenroll;
exports.getActivityParticipants = getActivityParticipants;
exports.remainingSpots = remainingSpots;
exports.rateOrganizer = rateOrganizer;
exports.listGroupActivities = listGroupActivities;
const db_1 = __importDefault(require("../config/db"));
function parseDateInput(value, field, allowNull = false) {
    if (value === null || value === undefined || value === "") {
        if (allowNull)
            return null;
        const err = new Error(`Invalid datetime for ${field}`);
        err.status = 400;
        err.code = "INVALID_DATETIME";
        throw err;
    }
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
        const err = new Error(`Invalid datetime for ${field}`);
        err.status = 400;
        err.code = "INVALID_DATETIME";
        throw err;
    }
    return date;
}
async function createActivity(userId, data) {
    const startAt = parseDateInput(data.start_at, "start_at");
    const endAt = parseDateInput(data.end_at, "end_at", true);
    const [res] = await db_1.default.query("INSERT INTO activities (group_id, sport_id, title, description, start_at, end_at, location, level, max_participants, status, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?, 'published', ?, NOW(), NOW())", [
        data.group_id,
        data.sport_id,
        data.title,
        data.description || null,
        startAt,
        endAt,
        data.location,
        data.level,
        data.max_participants || null,
        userId,
    ]);
    const id = res.insertId;
    // organizer auto-register
    await db_1.default.query("INSERT INTO activity_participants (activity_id, user_id, status, registered_at) VALUES (?,?, 'registered', NOW()) ON DUPLICATE KEY UPDATE status='registered', cancelled_at = NULL", [id, userId]);
    return getActivityById(id);
}
async function getActivityById(id) {
    const [rows] = await db_1.default.query(`SELECT a.*, s.name as sport_name, g.name as group_name,
      (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.id AND ap.status='registered') as registered_count
     FROM activities a
     JOIN sports s ON s.id = a.sport_id
     JOIN \`groups\` g ON g.id = a.group_id
     WHERE a.id = ?`, [id]);
    const list = rows;
    return list[0] || null;
}
async function updateActivity(userId, id, data) {
    // only creator can update
    const [rows] = await db_1.default.query("SELECT created_by FROM activities WHERE id = ?", [id]);
    const list = rows;
    if (list.length === 0) {
        const err = new Error("Activity not found");
        err.status = 404;
        err.code = "ACTIVITY_NOT_FOUND";
        throw err;
    }
    if (list[0].created_by !== userId) {
        const err = new Error("Forbidden");
        err.status = 403;
        err.code = "FORBIDDEN";
        throw err;
    }
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(data)) {
        if (k === "start_at" || k === "end_at") {
            const parsed = parseDateInput(v, k, true);
            fields.push(`${k} = ?`);
            values.push(parsed);
            continue;
        }
        fields.push(`${k} = ?`);
        values.push(v);
    }
    if (fields.length === 0)
        return getActivityById(id);
    values.push(id);
    await db_1.default.query(`UPDATE activities SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`, values);
    return getActivityById(id);
}
async function deleteActivity(userId, id) {
    const [rows] = await db_1.default.query("SELECT created_by FROM activities WHERE id = ?", [id]);
    const list = rows;
    if (list.length === 0)
        return true;
    if (list[0].created_by !== userId) {
        const err = new Error("Forbidden");
        err.status = 403;
        err.code = "FORBIDDEN";
        throw err;
    }
    await db_1.default.query("DELETE FROM activities WHERE id = ?", [id]);
    return true;
}
async function cancelActivity(userId, id) {
    const [rows] = await db_1.default.query("SELECT created_by FROM activities WHERE id = ?", [id]);
    const list = rows;
    if (list.length === 0) {
        const err = new Error("Activity not found");
        err.status = 404;
        err.code = "ACTIVITY_NOT_FOUND";
        throw err;
    }
    if (list[0].created_by !== userId) {
        const err = new Error("Forbidden");
        err.status = 403;
        err.code = "FORBIDDEN";
        throw err;
    }
    await db_1.default.query("UPDATE activities SET status='cancelled', cancelled_at = NOW(), updated_at = NOW() WHERE id = ?", [id]);
    return getActivityById(id);
}
async function enroll(userId, activityId) {
    // check capacity
    const [rows] = await db_1.default.query("SELECT max_participants, status FROM activities WHERE id = ?", [activityId]);
    const list = rows;
    if (list.length === 0) {
        const err = new Error("Activity not found");
        err.status = 404;
        err.code = "ACTIVITY_NOT_FOUND";
        throw err;
    }
    if (list[0].status !== 'published') {
        const err = new Error("Activity not open");
        err.status = 400;
        err.code = "NOT_OPEN";
        throw err;
    }
    const max = list[0].max_participants;
    if (max) {
        const [countRows] = await db_1.default.query("SELECT COUNT(*) as c FROM activity_participants WHERE activity_id = ? AND status='registered'", [activityId]);
        const c = countRows[0].c;
        if (c >= max) {
            const err = new Error("Activity full");
            err.status = 400;
            err.code = "ACTIVITY_FULL";
            throw err;
        }
    }
    await db_1.default.query("INSERT INTO activity_participants (activity_id, user_id, status, registered_at) VALUES (?,?, 'registered', NOW()) ON DUPLICATE KEY UPDATE status='registered', registered_at = NOW(), cancelled_at = NULL", [activityId, userId]);
    return true;
}
async function unenroll(userId, activityId) {
    await db_1.default.query("UPDATE activity_participants SET status='cancelled', cancelled_at = NOW() WHERE activity_id = ? AND user_id = ? AND status='registered'", [activityId, userId]);
    return true;
}
async function getActivityParticipants(activityId) {
    const [rows] = await db_1.default.query("SELECT ap.user_id as id, u.pseudo, u.avatar_url FROM activity_participants ap JOIN users u ON u.id = ap.user_id WHERE ap.activity_id = ? AND ap.status='registered' ORDER BY u.pseudo", [activityId]);
    return rows;
}
async function remainingSpots(activityId) {
    const [rows] = await db_1.default.query("SELECT max_participants FROM activities WHERE id = ?", [activityId]);
    const list = rows;
    if (list.length === 0)
        return null;
    const max = list[0].max_participants;
    const [countRows] = await db_1.default.query("SELECT COUNT(*) as c FROM activity_participants WHERE activity_id = ? AND status='registered'", [activityId]);
    const c = countRows[0].c;
    return max ? Math.max(0, max - c) : null;
}
async function rateOrganizer(activityId, raterUserId, score, comment) {
    // find organizer (created_by)
    const [rows] = await db_1.default.query("SELECT created_by FROM activities WHERE id = ?", [activityId]);
    const list = rows;
    if (list.length === 0) {
        const err = new Error("Activity not found");
        err.status = 404;
        err.code = "ACTIVITY_NOT_FOUND";
        throw err;
    }
    const organizerId = list[0].created_by;
    await db_1.default.query("INSERT INTO activity_ratings (activity_id, rated_user_id, rater_user_id, score, comment, created_at) VALUES (?,?,?,?,?, NOW()) ON DUPLICATE KEY UPDATE score=VALUES(score), comment=VALUES(comment)", [activityId, organizerId, raterUserId, score, comment || null]);
    return true;
}
async function listGroupActivities(groupId) {
    const [rows] = await db_1.default.query(`SELECT a.*, (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.id AND ap.status='registered') as registered_count
     FROM activities a WHERE a.group_id = ? ORDER BY a.start_at DESC LIMIT 100`, [groupId]);
    return rows;
}

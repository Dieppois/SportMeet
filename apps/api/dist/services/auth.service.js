"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.createPasswordResetToken = createPasswordResetToken;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
async function signup({ email, password, pseudo }) {
    const conn = await db_1.default.getConnection();
    try {
        await conn.beginTransaction();
        const [existing] = await conn.query("SELECT id FROM users WHERE email = ? OR pseudo = ? LIMIT 1", [email, pseudo]);
        const rows = existing;
        if (rows.length > 0) {
            const field = rows[0].email === email ? "email" : "pseudo";
            const err = new Error(`${field} already in use`);
            err.status = 409;
            err.code = "DUPLICATE";
            throw err;
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const [result] = await conn.query("INSERT INTO users (email, password_hash, pseudo, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())", [email, passwordHash, pseudo]);
        const insert = result;
        const userId = insert.insertId;
        await conn.commit();
        return { id: userId, email, pseudo };
    }
    catch (e) {
        await conn.rollback();
        throw e;
    }
    finally {
        conn.release();
    }
}
async function login(email, password) {
    const [rows] = await db_1.default.query("SELECT id, password_hash, pseudo, account_status FROM users WHERE email = ? LIMIT 1", [email]);
    const list = rows;
    if (list.length === 0) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }
    const user = list[0];
    if (user.account_status !== "active") {
        const err = new Error("Account not active");
        err.status = 403;
        err.code = "ACCOUNT_INACTIVE";
        throw err;
    }
    const ok = await bcrypt_1.default.compare(password, user.password_hash);
    if (!ok) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }
    return { id: user.id, email, pseudo: user.pseudo };
}
async function createPasswordResetToken(userId) {
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await db_1.default.query("INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at) VALUES (?,?,?, NOW())", [userId, token, expiresAt]);
    return { token, expiresAt };
}
async function resetPassword(token, newPassword) {
    const conn = await db_1.default.getConnection();
    try {
        await conn.beginTransaction();
        const [rows] = await conn.query("SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token = ? LIMIT 1", [token]);
        const list = rows;
        if (list.length === 0) {
            const err = new Error("Invalid token");
            err.status = 400;
            err.code = "INVALID_TOKEN";
            throw err;
        }
        const rec = list[0];
        if (rec.used_at || new Date(rec.expires_at).getTime() < Date.now()) {
            const err = new Error("Expired token");
            err.status = 400;
            err.code = "TOKEN_EXPIRED";
            throw err;
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        await conn.query("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?", [passwordHash, rec.user_id]);
        await conn.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [rec.id]);
        await conn.commit();
        return true;
    }
    catch (e) {
        await conn.rollback();
        throw e;
    }
    finally {
        conn.release();
    }
}
async function changePassword(userId, oldPassword, newPassword) {
    const [rows] = await db_1.default.query("SELECT password_hash FROM users WHERE id = ?", [userId]);
    const list = rows;
    if (list.length === 0) {
        const err = new Error("User not found");
        err.status = 404;
        err.code = "USER_NOT_FOUND";
        throw err;
    }
    const ok = await bcrypt_1.default.compare(oldPassword, list[0].password_hash);
    if (!ok) {
        const err = new Error("Invalid old password");
        err.status = 400;
        err.code = "INVALID_OLD_PASSWORD";
        throw err;
    }
    const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
    await db_1.default.query("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?", [passwordHash, userId]);
    return true;
}

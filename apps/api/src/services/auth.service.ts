import pool from "../config/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export type SignupInput = {
  email: string;
  password: string;
  pseudo: string;
};

export async function signup({ email, password, pseudo }: SignupInput) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query("SELECT id FROM users WHERE email = ? OR pseudo = ? LIMIT 1", [email, pseudo]);
    const rows = existing as any[];
    if (rows.length > 0) {
      const field = rows[0].email === email ? "email" : "pseudo";
      const err: any = new Error(`${field} already in use`);
      err.status = 409;
      err.code = "DUPLICATE";
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      "INSERT INTO users (email, password_hash, pseudo, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [email, passwordHash, pseudo]
    );
    const insert = result as any;
    const userId = insert.insertId as number;

    await conn.commit();

    return { id: userId, email, pseudo };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function login(email: string, password: string) {
  const [rows] = await pool.query("SELECT id, password_hash, pseudo, account_status FROM users WHERE email = ? LIMIT 1", [email]);
  const list = rows as any[];
  if (list.length === 0) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  const user = list[0];
  if (user.account_status !== "active") {
    const err: any = new Error("Account not active");
    err.status = 403;
    err.code = "ACCOUNT_INACTIVE";
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  return { id: user.id, email, pseudo: user.pseudo };
}

export async function createPasswordResetToken(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await pool.query(
    "INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at) VALUES (?,?,?, NOW())",
    [userId, token, expiresAt]
  );
  return { token, expiresAt };
}

export async function resetPassword(token: string, newPassword: string) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query(
      "SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token = ? LIMIT 1",
      [token]
    );
    const list = rows as any[];
    if (list.length === 0) {
      const err: any = new Error("Invalid token");
      err.status = 400;
      err.code = "INVALID_TOKEN";
      throw err;
    }
    const rec = list[0];
    if (rec.used_at || new Date(rec.expires_at).getTime() < Date.now()) {
      const err: any = new Error("Expired token");
      err.status = 400;
      err.code = "TOKEN_EXPIRED";
      throw err;
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await conn.query("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?", [passwordHash, rec.user_id]);
    await conn.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [rec.id]);
    await conn.commit();
    return true;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const [rows] = await pool.query("SELECT password_hash FROM users WHERE id = ?", [userId]);
  const list = rows as any[];
  if (list.length === 0) {
    const err: any = new Error("User not found");
    err.status = 404;
    err.code = "USER_NOT_FOUND";
    throw err;
  }
  const ok = await bcrypt.compare(oldPassword, list[0].password_hash);
  if (!ok) {
    const err: any = new Error("Invalid old password");
    err.status = 400;
    err.code = "INVALID_OLD_PASSWORD";
    throw err;
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?", [passwordHash, userId]);
  return true;
}

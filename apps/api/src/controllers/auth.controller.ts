import { Request, Response, NextFunction } from "express";
import { changePassword, createPasswordResetToken, login, resetPassword, signup } from "../services/auth.service";
import { signToken } from "../utils/jwt";

export async function signupController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, pseudo } = req.validatedBody || req.body;
    const user = await signup({ email, password, pseudo });
    const token = signToken({ sub: user.id });
    res.status(201).json({ user, token });
  } catch (e) {
    next(e);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.validatedBody || req.body;
    const user = await login(email, password);
    const token = signToken({ sub: user.id });
    res.json({ user, token });
  } catch (e) {
    next(e);
  }
}

export async function requestPasswordResetController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.validatedBody || req.body;
    // find user id by email
    // We avoid leaking existence; return 200 regardless
    // But if exists create token.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pool = (await import("../config/db")).default;
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    const list = rows as any[];
    if (list.length > 0) {
      const { token, expiresAt } = await createPasswordResetToken(list[0].id);
      // In real world send email. For now, return token for testing purposes.
      return res.json({ ok: true, token, expiresAt });
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function resetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.validatedBody || req.body;
    await resetPassword(token, newPassword);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function changePasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const { oldPassword, newPassword } = req.validatedBody || req.body;
    const userId = req.user!.id;
    await changePassword(userId, oldPassword, newPassword);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function googleLoginStubController(_req: Request, res: Response) {
  res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Google login not implemented yet" } });
}

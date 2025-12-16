import { Router } from "express";
import { z } from "zod";
import {
  changePasswordController,
  googleLoginStubController,
  loginController,
  requestPasswordResetController,
  resetPasswordController,
  signupController,
} from "../controllers/auth.controller";
import { validateBody } from "../utils/validation";
import { requireAuth } from "../middlewares/auth";

export const router = Router();

// POST /api/auth/signup
// body: { email, password, pseudo }
// response: { user: {id,email,pseudo}, token }
const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(4),
  pseudo: z.string().trim().min(2).max(50),
}).passthrough();
router.post("/signup", validateBody(signupSchema), signupController);

// POST /api/auth/login
// body: { email, password }
// response: { user, token }
const loginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(4) }).passthrough();
router.post("/login", validateBody(loginSchema), loginController);

// POST /api/auth/password/request-reset
// body: { email }
// response: { ok: true, token? } -- token returned only in dev for testing
router.post(
  "/password/request-reset",
  validateBody(z.object({ email: z.string().email() })),
  requestPasswordResetController
);

// POST /api/auth/password/reset
// body: { token, newPassword }
router.post(
  "/password/reset",
  validateBody(z.object({ token: z.string().length(64), newPassword: z.string().min(6) })),
  resetPasswordController
);

// POST /api/auth/password/change
// headers: Authorization: Bearer <token>
// body: { oldPassword, newPassword }
router.post(
  "/password/change",
  requireAuth,
  validateBody(z.object({ oldPassword: z.string().min(6), newPassword: z.string().min(6) })),
  changePasswordController
);

// GET /api/auth/google (stub)
router.get("/google", googleLoginStubController);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_1 = require("../utils/validation");
const auth_1 = require("../middlewares/auth");
exports.router = (0, express_1.Router)();
// POST /api/auth/signup
// body: { email, password, pseudo }
// response: { user: {id,email,pseudo}, token }
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email(),
    password: zod_1.z.string().min(4),
    pseudo: zod_1.z.string().trim().min(2).max(50),
}).passthrough();
exports.router.post("/signup", (0, validation_1.validateBody)(signupSchema), auth_controller_1.signupController);
// POST /api/auth/login
// body: { email, password }
// response: { user, token }
const loginSchema = zod_1.z.object({ email: zod_1.z.string().trim().toLowerCase().email(), password: zod_1.z.string().min(4) }).passthrough();
exports.router.post("/login", (0, validation_1.validateBody)(loginSchema), auth_controller_1.loginController);
// POST /api/auth/password/request-reset
// body: { email }
// response: { ok: true, token? } -- token returned only in dev for testing
exports.router.post("/password/request-reset", (0, validation_1.validateBody)(zod_1.z.object({ email: zod_1.z.string().email() })), auth_controller_1.requestPasswordResetController);
// POST /api/auth/password/reset
// body: { token, newPassword }
exports.router.post("/password/reset", (0, validation_1.validateBody)(zod_1.z.object({ token: zod_1.z.string().length(64), newPassword: zod_1.z.string().min(6) })), auth_controller_1.resetPasswordController);
// POST /api/auth/password/change
// headers: Authorization: Bearer <token>
// body: { oldPassword, newPassword }
exports.router.post("/password/change", auth_1.requireAuth, (0, validation_1.validateBody)(zod_1.z.object({ oldPassword: zod_1.z.string().min(6), newPassword: zod_1.z.string().min(6) })), auth_controller_1.changePasswordController);
// GET /api/auth/google (stub)
exports.router.get("/google", auth_controller_1.googleLoginStubController);

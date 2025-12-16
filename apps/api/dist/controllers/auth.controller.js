"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = signupController;
exports.loginController = loginController;
exports.requestPasswordResetController = requestPasswordResetController;
exports.resetPasswordController = resetPasswordController;
exports.changePasswordController = changePasswordController;
exports.googleLoginStubController = googleLoginStubController;
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("../utils/jwt");
async function signupController(req, res, next) {
    try {
        const { email, password, pseudo } = req.validatedBody || req.body;
        const user = await (0, auth_service_1.signup)({ email, password, pseudo });
        const token = (0, jwt_1.signToken)({ sub: user.id });
        res.status(201).json({ user, token });
    }
    catch (e) {
        next(e);
    }
}
async function loginController(req, res, next) {
    try {
        const { email, password } = req.validatedBody || req.body;
        const user = await (0, auth_service_1.login)(email, password);
        const token = (0, jwt_1.signToken)({ sub: user.id });
        res.json({ user, token });
    }
    catch (e) {
        next(e);
    }
}
async function requestPasswordResetController(req, res, next) {
    try {
        const { email } = req.validatedBody || req.body;
        // find user id by email
        // We avoid leaking existence; return 200 regardless
        // But if exists create token.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pool = (await Promise.resolve().then(() => __importStar(require("../config/db")))).default;
        const [rows] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
        const list = rows;
        if (list.length > 0) {
            const { token, expiresAt } = await (0, auth_service_1.createPasswordResetToken)(list[0].id);
            // In real world send email. For now, return token for testing purposes.
            return res.json({ ok: true, token, expiresAt });
        }
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function resetPasswordController(req, res, next) {
    try {
        const { token, newPassword } = req.validatedBody || req.body;
        await (0, auth_service_1.resetPassword)(token, newPassword);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function changePasswordController(req, res, next) {
    try {
        const { oldPassword, newPassword } = req.validatedBody || req.body;
        const userId = req.user.id;
        await (0, auth_service_1.changePassword)(userId, oldPassword, newPassword);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function googleLoginStubController(_req, res) {
    res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Google login not implemented yet" } });
}

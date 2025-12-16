"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.substring("Bearer ".length);
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
function requireRole(roles) {
    return (req, res, next) => {
        const role = req.user?.role || "user";
        if (!roles.includes(role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
}

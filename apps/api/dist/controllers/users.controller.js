"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeController = getMeController;
exports.updateMeController = updateMeController;
exports.setVisibilityController = setVisibilityController;
exports.setSportsController = setSportsController;
exports.deleteMeController = deleteMeController;
exports.getPublicProfileController = getPublicProfileController;
exports.searchUsersController = searchUsersController;
const users_service_1 = require("../services/users.service");
async function getMeController(req, res, next) {
    try {
        const me = await (0, users_service_1.getUserById)(req.user.id);
        res.json({ user: me });
    }
    catch (e) {
        next(e);
    }
}
async function updateMeController(req, res, next) {
    try {
        const userId = req.user.id;
        const user = await (0, users_service_1.updateProfile)(userId, req.validatedBody || req.body);
        res.json({ user });
    }
    catch (e) {
        next(e);
    }
}
async function setVisibilityController(req, res, next) {
    try {
        const userId = req.user.id;
        const { visibility } = req.validatedBody || req.body;
        const user = await (0, users_service_1.setProfileVisibility)(userId, visibility);
        res.json({ user });
    }
    catch (e) {
        next(e);
    }
}
async function setSportsController(req, res, next) {
    try {
        const userId = req.user.id;
        const { sports } = req.validatedBody || req.body;
        const user = await (0, users_service_1.setUserSports)(userId, sports);
        res.json({ user });
    }
    catch (e) {
        next(e);
    }
}
async function deleteMeController(req, res, next) {
    try {
        const userId = req.user.id;
        await (0, users_service_1.deleteAccount)(userId);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function getPublicProfileController(req, res, next) {
    try {
        const targetId = Number(req.params.id);
        const viewerId = req.user?.id || null;
        const profile = await (0, users_service_1.getPublicProfile)(viewerId, targetId);
        if (!profile)
            return res.status(404).json({ error: { code: "USER_NOT_FOUND", message: "User not found" } });
        res.json({ user: profile });
    }
    catch (e) {
        next(e);
    }
}
async function searchUsersController(req, res, next) {
    try {
        const q = String(req.query.q || "").trim();
        if (!q)
            return res.json({ users: [] });
        const users = await (0, users_service_1.searchUsersByPseudo)(q, 20);
        res.json({ users });
    }
    catch (e) {
        next(e);
    }
}

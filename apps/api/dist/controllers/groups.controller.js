"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupController = createGroupController;
exports.searchGroupsController = searchGroupsController;
exports.listUserGroupsController = listUserGroupsController;
exports.getGroupController = getGroupController;
exports.joinGroupController = joinGroupController;
exports.leaveGroupController = leaveGroupController;
exports.listMembersController = listMembersController;
const groups_service_1 = require("../services/groups.service");
async function createGroupController(req, res, next) {
    try {
        const userId = req.user.id;
        const group = await (0, groups_service_1.createGroup)(userId, req.validatedBody || req.body);
        res.status(201).json({ group });
    }
    catch (e) {
        next(e);
    }
}
async function searchGroupsController(req, res, next) {
    try {
        const { sport_id, level, city } = req.query;
        const groups = await (0, groups_service_1.searchGroups)({
            sport_id: sport_id ? Number(sport_id) : undefined,
            level: level ? String(level) : undefined,
            city: city ? String(city) : undefined,
        });
        res.json({ groups });
    }
    catch (e) {
        next(e);
    }
}
async function listUserGroupsController(req, res, next) {
    try {
        const userId = req.user.id;
        const groups = await (0, groups_service_1.listUserGroups)(userId);
        res.json({ groups });
    }
    catch (e) {
        next(e);
    }
}
async function getGroupController(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
        const group = await (0, groups_service_1.getGroupById)(id);
        if (!group)
            return res.status(404).json({ error: { code: "GROUP_NOT_FOUND", message: "Group not found" } });
        res.json({ group });
    }
    catch (e) {
        next(e);
    }
}
async function joinGroupController(req, res, next) {
    try {
        const userId = req.user.id;
        const groupId = Number(req.params.id);
        if (isNaN(groupId))
            return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
        await (0, groups_service_1.joinGroup)(userId, groupId);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function leaveGroupController(req, res, next) {
    try {
        const userId = req.user.id;
        const groupId = Number(req.params.id);
        if (isNaN(groupId))
            return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
        await (0, groups_service_1.leaveGroup)(userId, groupId);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function listMembersController(req, res, next) {
    try {
        const groupId = Number(req.params.id);
        if (isNaN(groupId))
            return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
        const members = await (0, groups_service_1.listMembers)(groupId);
        res.json({ members });
    }
    catch (e) {
        next(e);
    }
}

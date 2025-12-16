"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActivityMessagesController = listActivityMessagesController;
exports.sendActivityMessageController = sendActivityMessageController;
exports.reportActivityMessageController = reportActivityMessageController;
const chat_service_1 = require("../services/chat.service");
async function listActivityMessagesController(req, res, next) {
    try {
        const activityId = Number(req.params.id);
        if (Number.isNaN(activityId)) {
            return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid activity ID" } });
        }
        const limit = req.query.limit ? Number(req.query.limit) : 30;
        const before = req.query.before ? Number(req.query.before) : undefined;
        if (Number.isNaN(limit) || limit <= 0) {
            return res.status(400).json({ error: { code: "INVALID_LIMIT", message: "Invalid limit value" } });
        }
        if (before !== undefined && Number.isNaN(before)) {
            return res.status(400).json({ error: { code: "INVALID_CURSOR", message: "Invalid before value" } });
        }
        const messages = await (0, chat_service_1.listActivityMessages)(activityId, req.user.id, limit, before);
        res.json({ messages });
    }
    catch (e) {
        next(e);
    }
}
async function sendActivityMessageController(req, res, next) {
    try {
        const activityId = Number(req.params.id);
        if (Number.isNaN(activityId)) {
            return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid activity ID" } });
        }
        const { content } = req.validatedBody || req.body;
        const message = await (0, chat_service_1.sendActivityMessage)(activityId, req.user.id, content);
        res.status(201).json({ message });
    }
    catch (e) {
        next(e);
    }
}
async function reportActivityMessageController(req, res, next) {
    try {
        const activityId = Number(req.params.id);
        const messageId = Number(req.params.messageId);
        if (Number.isNaN(activityId) || Number.isNaN(messageId)) {
            return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid activity or message ID" } });
        }
        const { reason } = req.validatedBody || req.body;
        await (0, chat_service_1.reportActivityMessage)(activityId, messageId, req.user.id, reason);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}

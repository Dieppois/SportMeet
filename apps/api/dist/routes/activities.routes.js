"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const activities_controller_1 = require("../controllers/activities.controller");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../utils/validation");
exports.router = (0, express_1.Router)();
// POST /api/activities
const createSchema = zod_1.z.object({
    group_id: zod_1.z.number().int().positive(),
    sport_id: zod_1.z.number().int().positive(),
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().max(5000).nullable().optional(),
    start_at: zod_1.z.string(),
    end_at: zod_1.z.string().nullable().optional(),
    location: zod_1.z.string().min(2),
    level: zod_1.z.enum(["debutant", "intermediaire", "expert"]),
    max_participants: zod_1.z.number().int().positive().nullable().optional(),
});
exports.router.post("/", auth_1.requireAuth, (0, validation_1.validateBody)(createSchema), activities_controller_1.createActivityController);
// PATCH /api/activities/:id
exports.router.patch("/:id", auth_1.requireAuth, (0, validation_1.validateBody)(createSchema.partial()), activities_controller_1.updateActivityController);
// DELETE /api/activities/:id
exports.router.delete("/:id", auth_1.requireAuth, activities_controller_1.deleteActivityController);
// POST /api/activities/:id/cancel
exports.router.post("/:id/cancel", auth_1.requireAuth, activities_controller_1.cancelActivityController);
// GET /api/activities/:id
exports.router.get("/:id", activities_controller_1.getActivityController);
// POST /api/activities/:id/enroll
exports.router.post("/:id/enroll", auth_1.requireAuth, activities_controller_1.enrollController);
// POST /api/activities/:id/unenroll
exports.router.post("/:id/unenroll", auth_1.requireAuth, activities_controller_1.unenrollController);
// GET /api/activities/:id/participants
exports.router.get("/:id/participants", auth_1.requireAuth, activities_controller_1.participantsController);
// GET /api/activities/:id/remaining
exports.router.get("/:id/remaining", activities_controller_1.remainingSpotsController);
// POST /api/activities/:id/rate
exports.router.post("/:id/rate", auth_1.requireAuth, (0, validation_1.validateBody)(zod_1.z.object({ score: zod_1.z.number().min(1).max(5), comment: zod_1.z.string().max(1000).optional() })), activities_controller_1.rateOrganizerController);
// GET /api/groups/:groupId/activities
exports.router.get("/group/:groupId", activities_controller_1.listGroupActivitiesController);
// Activity chat
const chatMessageSchema = zod_1.z.object({ content: zod_1.z.string().min(1).max(2000) });
exports.router.get("/:id/chat/messages", auth_1.requireAuth, chat_controller_1.listActivityMessagesController);
exports.router.post("/:id/chat/messages", auth_1.requireAuth, (0, validation_1.validateBody)(chatMessageSchema), chat_controller_1.sendActivityMessageController);
exports.router.post("/:id/chat/messages/:messageId/report", auth_1.requireAuth, (0, validation_1.validateBody)(zod_1.z.object({ reason: zod_1.z.string().min(3).max(255) })), chat_controller_1.reportActivityMessageController);

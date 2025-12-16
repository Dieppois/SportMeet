"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const groups_controller_1 = require("../controllers/groups.controller");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../utils/validation");
exports.router = (0, express_1.Router)();
// POST /api/groups
const createSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    description: zod_1.z.string().max(2000).nullable().optional(),
    city: zod_1.z.string().min(2),
    sport_id: zod_1.z.number().int().positive(),
    level: zod_1.z.enum(["debutant", "intermediaire", "expert"]),
    visibility: zod_1.z.enum(["public", "private"]).optional(),
    max_members: zod_1.z.number().int().positive().nullable().optional(),
});
exports.router.post("/", auth_1.requireAuth, (0, validation_1.validateBody)(createSchema), groups_controller_1.createGroupController);
// GET /api/groups/search?sport_id=&level=&city=
exports.router.get("/search", groups_controller_1.searchGroupsController);
// GET /api/groups/mine
exports.router.get("/mine", auth_1.requireAuth, groups_controller_1.listUserGroupsController);
// GET /api/groups/:id
exports.router.get("/:id", groups_controller_1.getGroupController);
// POST /api/groups/:id/join
exports.router.post("/:id/join", auth_1.requireAuth, groups_controller_1.joinGroupController);
// POST /api/groups/:id/leave
exports.router.post("/:id/leave", auth_1.requireAuth, groups_controller_1.leaveGroupController);
// GET /api/groups/:id/members
exports.router.get("/:id/members", auth_1.requireAuth, groups_controller_1.listMembersController);

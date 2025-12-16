"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const users_controller_1 = require("../controllers/users.controller");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../utils/validation");
exports.router = (0, express_1.Router)();
// GET /api/users/me
exports.router.get("/me", auth_1.requireAuth, users_controller_1.getMeController);
// PATCH /api/users/me
// body: partial profile fields
const updateSchema = zod_1.z.object({
    first_name: zod_1.z.string().max(100).nullable().optional(),
    last_name: zod_1.z.string().max(100).nullable().optional(),
    city: zod_1.z.string().max(100).nullable().optional(),
    bio: zod_1.z.string().max(1000).nullable().optional(),
    avatar_url: zod_1.z.string().url().max(255).nullable().optional(),
});
exports.router.patch("/me", auth_1.requireAuth, (0, validation_1.validateBody)(updateSchema), users_controller_1.updateMeController);
// POST /api/users/me/visibility
const visibilitySchema = zod_1.z.object({ visibility: zod_1.z.enum(["public", "groups", "private"]) });
exports.router.post("/me/visibility", auth_1.requireAuth, (0, validation_1.validateBody)(visibilitySchema), users_controller_1.setVisibilityController);
// POST /api/users/me/sports
// body: { sports: [{ sport_id, level }] }
const sportsSchema = zod_1.z.object({
    sports: zod_1.z
        .array(zod_1.z.object({
        sport_id: zod_1.z.number().int().positive(),
        level: zod_1.z.enum(["debutant", "intermediaire", "expert"]),
    }))
        .max(20),
});
exports.router.post("/me/sports", auth_1.requireAuth, (0, validation_1.validateBody)(sportsSchema), users_controller_1.setSportsController);
// DELETE /api/users/me
exports.router.delete("/me", auth_1.requireAuth, users_controller_1.deleteMeController);
// GET /api/users/:id (public profile with privacy rules)
exports.router.get("/:id", users_controller_1.getPublicProfileController);
// GET /api/users?q= (search by pseudo)
exports.router.get("/", users_controller_1.searchUsersController);

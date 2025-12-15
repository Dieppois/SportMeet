import { Router } from "express";
import { z } from "zod";
import {
  deleteMeController,
  getMeController,
  getPublicProfileController,
  searchUsersController,
  setSportsController,
  setVisibilityController,
  updateMeController,
} from "../controllers/users.controller";
import { requireAuth } from "../middlewares/auth";
import { validateBody } from "../utils/validation";

export const router = Router();

// GET /api/users/me
router.get("/me", requireAuth, getMeController);

// PATCH /api/users/me
// body: partial profile fields
const updateSchema = z.object({
  first_name: z.string().max(100).nullable().optional(),
  last_name: z.string().max(100).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  avatar_url: z.string().url().max(255).nullable().optional(),
});
router.patch("/me", requireAuth, validateBody(updateSchema), updateMeController);

// POST /api/users/me/visibility
const visibilitySchema = z.object({ visibility: z.enum(["public", "groups", "private"]) });
router.post("/me/visibility", requireAuth, validateBody(visibilitySchema), setVisibilityController);

// POST /api/users/me/sports
// body: { sports: [{ sport_id, level }] }
const sportsSchema = z.object({
  sports: z
    .array(
      z.object({
        sport_id: z.number().int().positive(),
        level: z.enum(["debutant", "intermediaire", "expert"]),
      })
    )
    .max(20),
});
router.post("/me/sports", requireAuth, validateBody(sportsSchema), setSportsController);

// DELETE /api/users/me
router.delete("/me", requireAuth, deleteMeController);

// GET /api/users/:id (public profile with privacy rules)
router.get("/:id", getPublicProfileController);

// GET /api/users?q= (search by pseudo)
router.get("/", searchUsersController);

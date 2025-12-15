import { Router } from "express";
import { z } from "zod";
import {
  createGroupController,
  getGroupController,
  joinGroupController,
  leaveGroupController,
  listMembersController,
  searchGroupsController,
} from "../controllers/groups.controller";
import { requireAuth } from "../middlewares/auth";
import { validateBody } from "../utils/validation";

export const router = Router();

// POST /api/groups
const createSchema = z.object({
  name: z.string().min(3),
  description: z.string().max(2000).nullable().optional(),
  city: z.string().min(2),
  sport_id: z.number().int().positive(),
  level: z.enum(["debutant", "intermediaire", "expert"]),
  visibility: z.enum(["public", "private"]).optional(),
  max_members: z.number().int().positive().nullable().optional(),
});
router.post("/", requireAuth, validateBody(createSchema), createGroupController);

// GET /api/groups/search?sport_id=&level=&city=
router.get("/search", searchGroupsController);

// GET /api/groups/:id
router.get("/:id", getGroupController);

// POST /api/groups/:id/join
router.post("/:id/join", requireAuth, joinGroupController);

// POST /api/groups/:id/leave
router.post("/:id/leave", requireAuth, leaveGroupController);

// GET /api/groups/:id/members
router.get("/:id/members", requireAuth, listMembersController);

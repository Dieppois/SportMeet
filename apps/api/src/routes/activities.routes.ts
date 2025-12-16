import { Router } from "express";
import { z } from "zod";
import {
  cancelActivityController,
  createActivityController,
  deleteActivityController,
  enrollController,
  getActivityController,
  listGroupActivitiesController,
  participantsController,
  rateOrganizerController,
  remainingSpotsController,
  unenrollController,
  updateActivityController,
} from "../controllers/activities.controller";
import {
  listActivityMessagesController,
  reportActivityMessageController,
  sendActivityMessageController,
} from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/auth";
import { validateBody } from "../utils/validation";

export const router = Router();

// POST /api/activities
const createSchema = z.object({
  group_id: z.number().int().positive(),
  sport_id: z.number().int().positive(),
  title: z.string().min(3),
  description: z.string().max(5000).nullable().optional(),
  start_at: z.string(),
  end_at: z.string().nullable().optional(),
  location: z.string().min(2),
  level: z.enum(["debutant", "intermediaire", "expert"]),
  max_participants: z.number().int().positive().nullable().optional(),
});
router.post("/", requireAuth, validateBody(createSchema), createActivityController);

// PATCH /api/activities/:id
router.patch("/:id", requireAuth, validateBody(createSchema.partial()), updateActivityController);

// DELETE /api/activities/:id
router.delete("/:id", requireAuth, deleteActivityController);

// POST /api/activities/:id/cancel
router.post("/:id/cancel", requireAuth, cancelActivityController);

// GET /api/activities/:id
router.get("/:id", getActivityController);

// POST /api/activities/:id/enroll
router.post("/:id/enroll", requireAuth, enrollController);

// POST /api/activities/:id/unenroll
router.post("/:id/unenroll", requireAuth, unenrollController);

// GET /api/activities/:id/participants
router.get("/:id/participants", requireAuth, participantsController);

// GET /api/activities/:id/remaining
router.get("/:id/remaining", remainingSpotsController);

// POST /api/activities/:id/rate
router.post(
  "/:id/rate",
  requireAuth,
  validateBody(z.object({ score: z.number().min(1).max(5), comment: z.string().max(1000).optional() })),
  rateOrganizerController
);

// GET /api/groups/:groupId/activities
router.get("/group/:groupId", listGroupActivitiesController);

// Activity chat
const chatMessageSchema = z.object({ content: z.string().min(1).max(2000) });
router.get("/:id/chat/messages", requireAuth, listActivityMessagesController);
router.post("/:id/chat/messages", requireAuth, validateBody(chatMessageSchema), sendActivityMessageController);
router.post(
  "/:id/chat/messages/:messageId/report",
  requireAuth,
  validateBody(z.object({ reason: z.string().min(3).max(255) })),
  reportActivityMessageController
);

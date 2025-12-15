import { Request, Response, NextFunction } from "express";
import {
  cancelActivity,
  createActivity,
  deleteActivity,
  enroll,
  getActivityById,
  getActivityParticipants,
  listGroupActivities,
  rateOrganizer,
  remainingSpots,
  unenroll,
  updateActivity,
} from "../services/activities.service";

export async function createActivityController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const activity = await createActivity(userId, req.validatedBody || req.body);
    res.status(201).json({ activity });
  } catch (e) {
    next(e);
  }
}

export async function updateActivityController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const activity = await updateActivity(userId, id, req.validatedBody || req.body);
    res.json({ activity });
  } catch (e) {
    next(e);
  }
}

export async function deleteActivityController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    await deleteActivity(userId, id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function cancelActivityController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const activity = await cancelActivity(userId, id);
    res.json({ activity });
  } catch (e) {
    next(e);
  }
}

export async function getActivityController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const activity = await getActivityById(id);
    if (!activity) return res.status(404).json({ error: { code: "ACTIVITY_NOT_FOUND", message: "Activity not found" } });
    res.json({ activity });
  } catch (e) {
    next(e);
  }
}

export async function enrollController(req: Request, res: Response, next: NextFunction) {
  try {
    await enroll(req.user!.id, Number(req.params.id));
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function unenrollController(req: Request, res: Response, next: NextFunction) {
  try {
    await unenroll(req.user!.id, Number(req.params.id));
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function participantsController(req: Request, res: Response, next: NextFunction) {
  try {
    const members = await getActivityParticipants(Number(req.params.id));
    res.json({ participants: members });
  } catch (e) {
    next(e);
  }
}

export async function remainingSpotsController(req: Request, res: Response, next: NextFunction) {
  try {
    const remaining = await remainingSpots(Number(req.params.id));
    res.json({ remaining });
  } catch (e) {
    next(e);
  }
}

export async function rateOrganizerController(req: Request, res: Response, next: NextFunction) {
  try {
    const activityId = Number(req.params.id);
    const { score, comment } = req.validatedBody || req.body;
    await rateOrganizer(activityId, req.user!.id, score, comment || null);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function listGroupActivitiesController(req: Request, res: Response, next: NextFunction) {
  try {
    const groupId = Number(req.params.groupId);
    const activities = await listGroupActivities(groupId);
    res.json({ activities });
  } catch (e) {
    next(e);
  }
}

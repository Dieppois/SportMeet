import { Request, Response, NextFunction } from "express";
import { createGroup, getGroupById, joinGroup, leaveGroup, listMembers, listUserGroups, searchGroups } from "../services/groups.service";

export async function createGroupController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const group = await createGroup(userId, req.validatedBody || req.body);
    res.status(201).json({ group });
  } catch (e) {
    next(e);
  }
}

export async function searchGroupsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { sport_id, level, city } = req.query;
    const groups = await searchGroups({
      sport_id: sport_id ? Number(sport_id) : undefined,
      level: level ? String(level) : undefined,
      city: city ? String(city) : undefined,
    });
    res.json({ groups });
  } catch (e) {
    next(e);
  }
}

export async function listUserGroupsController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const groups = await listUserGroups(userId);
    res.json({ groups });
  } catch (e) {
    next(e);
  }
}

export async function getGroupController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
    const group = await getGroupById(id);
    if (!group) return res.status(404).json({ error: { code: "GROUP_NOT_FOUND", message: "Group not found" } });
    res.json({ group });
  } catch (e) {
    next(e);
  }
}

export async function joinGroupController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const groupId = Number(req.params.id);
    if (isNaN(groupId)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
    await joinGroup(userId, groupId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function leaveGroupController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const groupId = Number(req.params.id);
    if (isNaN(groupId)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
    await leaveGroup(userId, groupId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function listMembersController(req: Request, res: Response, next: NextFunction) {
  try {
    const groupId = Number(req.params.id);
    if (isNaN(groupId)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid group ID" } });
    const members = await listMembers(groupId);
    res.json({ members });
  } catch (e) {
    next(e);
  }
}

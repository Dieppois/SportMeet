import { Request, Response, NextFunction } from "express";
import {
  deleteAccount,
  getPublicProfile,
  getUserById,
  searchUsersByPseudo,
  setProfileVisibility,
  setUserSports,
  updateProfile,
} from "../services/users.service";

export async function getMeController(req: Request, res: Response, next: NextFunction) {
  try {
    const me = await getUserById(req.user!.id);
    res.json({ user: me });
  } catch (e) {
    next(e);
  }
}

export async function updateMeController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const user = await updateProfile(userId, req.validatedBody || req.body);
    res.json({ user });
  } catch (e) {
    next(e);
  }
}

export async function setVisibilityController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { visibility } = req.validatedBody || req.body;
    const user = await setProfileVisibility(userId, visibility);
    res.json({ user });
  } catch (e) {
    next(e);
  }
}

export async function setSportsController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { sports } = req.validatedBody || req.body;
    const user = await setUserSports(userId, sports);
    res.json({ user });
  } catch (e) {
    next(e);
  }
}

export async function deleteMeController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    await deleteAccount(userId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function getPublicProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const targetId = Number(req.params.id);
    const viewerId = req.user?.id || null;
    const profile = await getPublicProfile(viewerId, targetId);
    if (!profile) return res.status(404).json({ error: { code: "USER_NOT_FOUND", message: "User not found" } });
    res.json({ user: profile });
  } catch (e) {
    next(e);
  }
}

export async function searchUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json({ users: [] });
    const users = await searchUsersByPseudo(q, 20);
    res.json({ users });
  } catch (e) {
    next(e);
  }
}

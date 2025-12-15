import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export type AuthUser = {
  id: number;
  role?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.substring("Bearer ".length);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role || "user";
    if (!roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

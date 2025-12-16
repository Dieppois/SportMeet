import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

function normalizeInput(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeInput);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, normalizeInput(val)]));
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const cleanedBody = normalizeInput(req.body);
    const result = schema.safeParse(cleanedBody);
    if (!result.success) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid request body", details: result.error.flatten() } });
    }
    // @ts-ignore
    req.validatedBody = result.data;
    next();
  };
}

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
    }
  }
}

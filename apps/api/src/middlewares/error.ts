import { NextFunction, Request, Response } from "express";

// Standard JSON error format middleware
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Internal Server Error";
  const details = err.details;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("Error: ", err);
  }

  res.status(status).json({ error: { code, message, details } });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Resource not found" } });
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { router as healthRouter } from "./routes/health";
import { router as authRouter } from "./routes/auth.routes";
import { router as usersRouter } from "./routes/users.routes";
import { router as groupsRouter } from "./routes/groups.routes";
import { router as activitiesRouter } from "./routes/activities.routes";
import { errorHandler, notFound } from "./middlewares/error";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONT_ORIGINS?.split(",") || ["http://localhost:5174"],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(morgan("dev"));

  // Routes
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/groups", groupsRouter);
  app.use("/api/activities", activitiesRouter);

  // 404 and error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}



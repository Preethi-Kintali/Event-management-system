import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:8081", credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (simple)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

import { authRoutes } from "./routes/auth.routes";
import { eventRoutes } from "./routes/events.routes";
import { organizationRoutes } from "./routes/organizations.routes";
import { userRoutes } from "./routes/users.routes";
import { roleRoutes } from "./routes/roles.routes";
import { permissionRoutes } from "./routes/permissions.routes";
import { competitionRoutes } from "./routes/competitions.routes";
import { registrationRoutes } from "./routes/registrations.routes";
import { teamRoutes } from "./routes/teams.routes";
import { submissionRoutes } from "./routes/submissions.routes";
import { evaluationRoutes } from "./routes/evaluations.routes";
import { judgeRoutes } from "./routes/judges.routes";
import { mentorRoutes } from "./routes/mentors.routes";
import { volunteerRoutes } from "./routes/volunteers.routes";
import { attendanceRoutes } from "./routes/attendance.routes";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/competitions", competitionRoutes);
app.use("/api/v1/registrations", registrationRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/evaluations", evaluationRoutes);
app.use("/api/v1/judges", judgeRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/volunteers", volunteerRoutes);
app.use("/api/v1/attendance", attendanceRoutes);

// Health check endpoint
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({ success: true, message: "Ascent API is healthy" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found.",
      details: [],
    },
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred.",
      details: err.details || [],
    },
  });
});

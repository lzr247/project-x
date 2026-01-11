import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import goalRoutes from "./routes/goal.routes";
import pomodoroRoutes from "./routes/pomodoro.routes";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", goalRoutes);
app.use("/api/pomodoro", pomodoroRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});

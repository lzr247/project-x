import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  startPomodoro,
  completePomodoro,
  getPomodoroStats,
} from "../controllers/pomodoro.controller";
import { validateStartPomodoro } from "../middleware/validation.middleware";

const router = express.Router();

router.use(authMiddleware);

// POST /api/pomodoro/start
router.post("/start", validateStartPomodoro, startPomodoro);

// PUT /api/pomodoro/:id/complete
router.post("/:id/complete", completePomodoro);

// GET /api/pomodoro/stats
router.get("/stats", getPomodoroStats);

export default router;

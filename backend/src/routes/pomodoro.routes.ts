import express from "express";
import { completePomodoro, getPomodoroStats, startPomodoro } from "../controllers/pomodoro.controller";
import { authMiddleware } from "../middleware/auth.middleware";
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

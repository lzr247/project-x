import express from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goal.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  validateCreateGoal,
  validateUpdateGoal,
} from "../middleware/validation.middleware";

const router = express.Router();

router.use(authMiddleware);

// GET /api/projects/:projectId/goals
router.get("/projects/:projectId/goals", getGoals);

// POST /api/projects/:projectId/goals
router.post("/projects/:projectId/goals", validateCreateGoal, createGoal);

// PUT /api/goals/:id
router.put("/goals/:id", validateUpdateGoal, updateGoal);

// DELETE /api/goals/:id
router.delete("/goals/:id", deleteGoal);

export default router;

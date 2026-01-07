import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  validateCreateProject,
  validateUpdateProject,
} from "../middleware/validation.middleware";

const router = express.Router();

router.use(authMiddleware);

// GET /api/projects
router.get("/", getProjects);

// GET /api/projects/:id
router.get("/:id", getProjectById);

// POST /api/projects
router.post("/", validateCreateProject, createProject);

// PUT /api/projects/:id
router.put("/:id", validateUpdateProject, updateProject);

// DELETE /api/projects/:id
router.delete("/:id", deleteProject);

export default router;

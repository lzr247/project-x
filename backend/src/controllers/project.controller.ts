import { Request, Response } from "express";
import { prisma } from "../config/database";

// GET /api/projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const showArchived = req.query.archived === "true";

    const projects = await prisma.project.findMany({
      where: { userId, isArchived: showArchived },
      include: {
        _count: {
          select: { goals: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Add completedGoals count
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const completedGoals = await prisma.goal.count({
          where: { projectId: project.id, isCompleted: true },
        });

        return {
          ...project,
          _count: {
            goals: project._count.goals,
            completedGoals,
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: projectsWithCounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET /api/projects/:id
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: { goals: true },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// POST /api/projects
export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title, description, color } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        color,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.id;
    const { title, description, color, status, isArchived } = req.body;

    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        color,
        status,
        isArchived,
        ...(status === "COMPLETED" && existingProject.status !== "COMPLETED" ? { completedAt: new Date() } : {}),
        ...(status && status !== "COMPLETED" && existingProject.status === "COMPLETED" ? { completedAt: null } : {}),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.id;

    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

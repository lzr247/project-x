import { Request, Response } from "express";
import { prisma } from "../config/database";

// GET /api/projects/:projectId/goals
export const getGoals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.projectId;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const goals = await prisma.goal.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// POST /api/projects/:projectId/goals
export const createGoal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.projectId;
    const { title, description } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        projectId,
      },
    });

    return res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// PUT /api/goals/:id
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const goalId = req.params.id;
    const { title, description, isCompleted } = req.body;

    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { project: true },
    });

    if (!existingGoal || existingGoal.project.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title,
        description,
        isCompleted,
      },
    });

    return res.status(200).json({
      success: false,
      data: updatedGoal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// DELETE /api/goals/:id
export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const goalId = req.params.id;

    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { project: true },
    });

    if (!existingGoal || existingGoal.project.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

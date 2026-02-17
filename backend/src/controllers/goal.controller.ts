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
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
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

    const maxOrderGoal = await prisma.goal.findFirst({
      where: { projectId, isCompleted: false },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (maxOrderGoal?.order ?? -1) + 1;

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        projectId,
        order: nextOrder,
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
        ...(isCompleted === true && !existingGoal.isCompleted ? { completedAt: new Date() } : {}),
        ...(isCompleted === false && existingGoal.isCompleted ? { completedAt: null } : {}),
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedGoal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// PUT /api/projects/:projectId/goals/reorder
export const reorderGoals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.projectId;
    const { items } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.goal.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: "Goals reordered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// DELETE /api/projects/:projectId/goals/completed
export const clearCompletedGoals = async (req: Request, res: Response) => {
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

    const result = await prisma.goal.deleteMany({
      where: { projectId, isCompleted: true },
    });

    return res.status(200).json({
      success: true,
      message: `${result.count} completed goal(s) cleared.`,
      data: { count: result.count },
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

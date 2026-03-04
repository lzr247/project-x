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
    const { title, description, dueDate, recurrence } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const [, goal] = await prisma.$transaction([
      prisma.goal.updateMany({
        where: { projectId, isCompleted: false },
        data: { order: { increment: 1 } },
      }),
      prisma.goal.create({
        data: {
          title,
          description,
          projectId,
          order: 0,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          recurrence: recurrence ?? undefined,
        },
      }),
    ]);

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
    const { title, description, isCompleted, dueDate, recurrence, createNextRecurrence } = req.body;

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
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        recurrence: recurrence !== undefined ? recurrence : undefined,
        ...(isCompleted === true && !existingGoal.isCompleted ? { completedAt: new Date() } : {}),
        ...(isCompleted === false && existingGoal.isCompleted ? { completedAt: null } : {}),
      },
    });

    // If recurring - create next goal
    let nextGoal = null;
    if (createNextRecurrence && isCompleted && !existingGoal.isCompleted && updatedGoal.recurrence && updatedGoal.dueDate) {
      const nextDueDate = new Date(updatedGoal.dueDate);
      if (updatedGoal.recurrence === "DAILY") nextDueDate.setDate(nextDueDate.getDate() + 1);
      else if (updatedGoal.recurrence === "WEEKLY") nextDueDate.setDate(nextDueDate.getDate() + 7);
      else nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      const [, created] = await prisma.$transaction([
        prisma.goal.updateMany({
          where: { projectId: existingGoal.projectId, isCompleted: false },
          data: { order: { increment: 1 } },
        }),
        prisma.goal.create({
          data: {
            title: updatedGoal.title,
            description: updatedGoal.description,
            projectId: existingGoal.projectId,
            dueDate: nextDueDate,
            recurrence: updatedGoal.recurrence,
            order: 0,
          },
        }),
      ]);
      nextGoal = created;
    }

    return res.status(200).json({
      success: true,
      data: { goal: updatedGoal, nextGoal },
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

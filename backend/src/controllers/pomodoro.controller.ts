import { Request, Response } from "express";
import { prisma } from "../config/database";

// POST /api/pomodoro/start
export const startPomodoro = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { projectId, duration = 25 } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }
    }

    const session = await prisma.pomodoroSession.create({
      data: {
        duration,
        startTime: new Date(),
        userId,
        projectId: projectId || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// PUT /api/pomodoro/:id/complete
export const completePomodoro = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.id;

    const session = await prisma.pomodoroSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    if (session.completed) {
      return res.status(400).json({
        success: false,
        message: "Session already completed.",
      });
    }

    const updatedSession = await prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        completed: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET /api/pomodoro/stats
export const getPomodoroStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { period = "today" } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "all":
        startDate = new Date(0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // Sum number of sessions and minutes
    const sessions = await prisma.pomodoroSession.findMany({
      where: {
        userId,
        completed: true,
        startTime: { gte: startDate },
      },
      include: {
        project: true,
      },
    });

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

    const byProject = sessions.reduce((acc: any[], session) => {
      const projectId = session.projectId || "no-project";
      const projectTitle = session.project?.title || "No Project";

      const existing = acc.find((p) => p.projectId === projectId);
      if (existing) {
        existing.count += 1;
        existing.minutes += session.duration;
      } else {
        acc.push({
          projectId,
          projectTitle,
          count: 1,
          minutes: session.duration,
        });
      }
      return acc;
    }, []);

    return res.status(200).json({
      success: true,
      data: {
        period,
        totalSessions,
        totalMinutes,
        byProject,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

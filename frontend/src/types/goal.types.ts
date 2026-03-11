import type { Project } from "./project.types";

export type Recurrence = "DAILY" | "WEEKLY" | "MONTHLY";

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  order: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  completedAt: string | null;
  recurrence: Recurrence | null;
}

export interface ProjectWithGoals extends Project {
  goals: Goal[];
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  dueDate?: string;
  recurrence?: Recurrence;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string | null;
  recurrence?: Recurrence | null;
  createNextRecurrence?: boolean;
}

export interface UpdateGoalResponse {
  goal: Goal;
  nextGoal: Goal | null;
}

export interface CalendarGoal extends Goal {
  project: {
    id: string;
    title: string;
    color: string;
  };
}
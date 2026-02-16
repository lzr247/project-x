export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  color: string;
  status: ProjectStatus;
  completedAt: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _count?: {
    goals: number;
    completedGoals: number;
  };
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  color?: string;
  status?: ProjectStatus;
  isArchived?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  completedAt: string | null;
}

export interface ProjectWithGoals extends Project {
  goals: Goal[];
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

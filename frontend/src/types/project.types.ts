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

export interface GetProjectsParams {
  archived?: boolean;
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "progress";
  sortOrder?: "asc" | "desc";
}
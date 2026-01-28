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

export interface Project {
  id: string;
  title: string;
  description: string | null;
  color: string;
  isCompleted: boolean;
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
  isCompleted?: boolean;
}

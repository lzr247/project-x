import type {
  CalendarGoal,
  CreateGoalRequest,
  CreateProjectRequest,
  GetProjectsParams,
  Goal,
  PaginatedResponse,
  Project,
  ProjectWithGoals,
  UpdateGoalRequest,
  UpdateGoalResponse,
  UpdateProjectRequest,
} from "../types";
import api from "./axios.config";

// Projects API
export const getProjects = async (
  params: GetProjectsParams = {},
  signal?: AbortSignal
): Promise<PaginatedResponse<Project>> => {
  const query = new URLSearchParams();
  if (params.archived) query.set("archived", "true");
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  const { data } = await api.get(`/projects?${query.toString()}`, { signal });
  return { data: data.data, pagination: data.pagination };
};

export const getProjectById = async (id: string): Promise<ProjectWithGoals> => {
  const { data } = await api.get(`/projects/${id}`);
  return data.data;
};

export const createProject = async (body: CreateProjectRequest): Promise<Project> => {
  const response = await api.post("/projects", body);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const updateProject = async (id: string, body: UpdateProjectRequest): Promise<Project> => {
  const { data } = await api.put(`/projects/${id}`, body);
  return data.data;
};

// Goals API
export const getGoals = async (projectId: string): Promise<Goal[]> => {
  const { data } = await api.get(`/projects/${projectId}/goals`);
  return data;
};

export const createGoal = async (projectId: string, body: CreateGoalRequest): Promise<Goal> => {
  const { data } = await api.post(`/projects/${projectId}/goals`, body);
  return data;
};

export const updateGoal = async (goalId: string, body: UpdateGoalRequest): Promise<UpdateGoalResponse> => {
  const { data } = await api.put(`/goals/${goalId}`, body);
  return data;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  await api.delete(`/goals/${goalId}`);
};

export const reorderGoals = async (projectId: string, items: { id: string; order: number }[]): Promise<void> => {
  await api.put(`/projects/${projectId}/goals/reorder`, { items });
};

export const clearCompletedGoals = async (projectId: string): Promise<{ count: number }> => {
  const { data } = await api.delete(`/projects/${projectId}/goals/completed`);
  return data.data;
};

export const getCalendarGoals = async (startDate: string, endDate: string): Promise<CalendarGoal[]> => {
  const { data } = await api.get(`/goals/calendar?startDate=${startDate}&endDate=${endDate}`);
  return data.data;
};

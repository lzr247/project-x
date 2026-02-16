import type {
  CreateGoalRequest,
  CreateProjectRequest,
  Goal,
  Project,
  ProjectWithGoals,
  UpdateGoalRequest,
  UpdateProjectRequest,
} from "../types";
import api from "./axios.config";

// Projects API
export const getProjects = async (archived: boolean = false): Promise<Project[]> => {
  const { data } = await api.get(`/projects?archived=${archived}`);
  return data.data;
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

export const updateGoal = async (goalId: string, body: UpdateGoalRequest): Promise<Goal> => {
  const { data } = await api.put(`/goals/${goalId}`, body);
  return data;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  await api.delete(`/goals/${goalId}`);
};

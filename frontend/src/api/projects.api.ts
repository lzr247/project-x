import type { CreateProjectRequest, Project } from "../types";
import api from "./axios.config";

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/projects");
  return data.data;
};

export const createProject = async (
  body: CreateProjectRequest
): Promise<Project> => {
  const response = await api.post("/projects", body);
  return response.data;
};

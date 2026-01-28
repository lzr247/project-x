import api from "./axios.config";

export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data.data;
};

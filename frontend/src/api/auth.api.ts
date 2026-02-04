import type { AuthResponse, LoginCredentials, RegisterCredentials } from "../types";
import api from "./axios.config";

export const register = async (body: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/register", body);
  return {
    user: data.user,
    token: data.token,
  };
};

export const login = async (body: LoginCredentials) => {
  const { data } = await api.post("/auth/login", body);
  return {
    user: data.user,
    token: data.token,
  };
};

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { login, register } from "../api/auth.api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
}));

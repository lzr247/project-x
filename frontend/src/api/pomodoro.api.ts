import type { PomodoroSession, PomodoroStats } from "./../types/pomodoro.types";
import api from "./axios.config";

export const startSession = async (duration: number, projectId?: string): Promise<PomodoroSession> => {
  const { data } = await api.post("/pomodoro/start", { duration, ...(projectId ? { projectId } : {}) });
  return data.data;
};

export const completeSession = async (sessionId: string): Promise<PomodoroSession> => {
  const { data } = await api.post(`/pomodoro/${sessionId}/complete`);
  return data.data;
};

export const getPomodoroStats = async (period: "today" | "week" | "month" | "all"): Promise<PomodoroStats> => {
  const { data } = await api.get("/pomodoro/stats", { params: { period } });
  return data.data;
};

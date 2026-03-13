export type TimerStatus = "idle" | "running" | "paused" | "completed";
export type TimerMode = "focus" | "shortBreak" | "longBreak";

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  secondsLeft: number;
  focusCount: number;
}

export type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET"; settings: TimerSettings }
  | { type: "SWITCH_MODE"; mode: TimerMode; settings: TimerSettings }
  | { type: "TICK" }
  | { type: "ADVANCE"; settings: TimerSettings; autoStart: boolean }
  | { type: "SYNC_SETTINGS"; settings: TimerSettings };

export interface PomodoroSession {
  id: string;
  duration: number;
  startTime: string;
  endTime: string | null;
  completed: boolean;
  projectId: string | null;
  createdAt: string;
}

export interface PomodoroStats {
  totalSessions: number;
  totalMinutes: number;
  byProject: {
    projectId: string;
    projectTitle: string;
    sessions: number;
    minutes: number;
  }[];
}

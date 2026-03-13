import { useCallback, useEffect, useReducer, useRef } from "react";
import type { TimerAction, TimerMode, TimerSettings, TimerState } from "../types";

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

const getDuration = (mode: TimerMode, settings: TimerSettings): number => {
  if (mode === "focus") return settings.focusDuration * 60;
  if (mode === "shortBreak") return settings.shortBreakDuration * 60;
  return settings.longBreakDuration * 60;
};

function getNextMode(mode: TimerMode, focusCount: number, interval: number): TimerMode {
  if (mode !== "focus") return "focus";
  return focusCount % interval === interval - 1 ? "longBreak" : "shortBreak";
}

function getInitialState(settings: TimerSettings): TimerState {
  return {
    mode: "focus",
    status: "idle",
    secondsLeft: getDuration("focus", settings),
    focusCount: 0,
  };
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };
    case "PAUSE":
      return { ...state, status: "paused" };
    case "RESET":
      return { ...state, status: "idle", secondsLeft: getDuration(state.mode, action.settings) };
    case "SWITCH_MODE":
      return {
        ...state,
        status: "idle",
        mode: action.mode,
        secondsLeft: getDuration(action.mode, action.settings),
      };
    case "TICK": {
      if (state.secondsLeft <= 1) {
        const newFocusCount = state.mode === "focus" ? state.focusCount + 1 : state.focusCount;
        return { ...state, status: "completed", secondsLeft: 0, focusCount: newFocusCount };
      }
      return { ...state, secondsLeft: state.secondsLeft - 1 };
    }
    case "ADVANCE": {
      const nextMode = getNextMode(state.mode, state.focusCount, action.settings.longBreakInterval);
      return {
        ...state,
        mode: nextMode,
        status: action.autoStart ? "running" : "idle",
        secondsLeft: getDuration(nextMode, action.settings),
      };
    }
    case "SYNC_SETTINGS": {
      if (state.status !== "idle") return state;
      return { ...state, secondsLeft: getDuration(state.mode, action.settings) };
    }
  }
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {
    // AudioContext not available
  }
}

export const useTimer = (settings: TimerSettings = DEFAULT_SETTINGS) => {
  const [state, dispatch] = useReducer(timerReducer, settings, getInitialState);
  const { mode, status, secondsLeft, focusCount } = state;

  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Tick
  useEffect(() => {
    if (status !== "running") {
      clear();
      return;
    }
    intervalRef.current = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
    return clear;
  }, [status]);

  // On completion: play sound then auto-advance
  useEffect(() => {
    if (status !== "completed") return;
    playBeep();
    const autoStart = mode === "focus" ? settings.autoStartBreaks : settings.autoStartPomodoros;
    dispatch({ type: "ADVANCE", settings, autoStart });
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tab title
  useEffect(() => {
    if (status === "idle") {
      document.title = "Pomodoro";
      return;
    }
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");
    const label = mode === "focus" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break";
    document.title = `${m}:${s} — ${label}`;
    return () => {
      document.title = "Pomodoro";
    };
  }, [secondsLeft, status, mode]);

  // Sync displayed time when settings change (but only if idle)
  useEffect(() => {
    dispatch({ type: "SYNC_SETTINGS", settings });
  }, [settings]);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET", settings }), [settings]);
  const switchMode = useCallback(
    (newMode: TimerMode) => dispatch({ type: "SWITCH_MODE", mode: newMode, settings }),
    [settings]
  );

  const totalSeconds = getDuration(mode, settings);

  return { mode, status, secondsLeft, focusCount, totalSeconds, start, pause, reset, switchMode };
};

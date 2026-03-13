import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { completeSession, startSession } from "../api/pomodoro.api";
import { getProjects } from "../api/projects.api";
import { ProjectSelector } from "../components/pomodoro/ProjectSelector";
import SettingsPanel from "../components/pomodoro/SettingsPanel";
import { StatsPanel } from "../components/pomodoro/StatsPanel";
import TimerControls from "../components/pomodoro/TimerControls";
import TimerRing from "../components/pomodoro/TimerRing";
import { useTimer } from "../hooks/useTimer";
import { useTimerSettings } from "../hooks/useTimerSettings";
import type { TimerMode } from "../types";

const MODE_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const Pomodoro = () => {
  const { settings, updateSettings } = useTimerSettings();
  const { mode, status, secondsLeft, totalSeconds, start, pause, reset, switchMode } = useTimer(settings);
  const queryClient = useQueryClient();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const activeSessionId = useRef<string | null>(null);
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects({}),
  });
  const projects = projectsData?.data ?? [];
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;

  // When focus timer starts -> create session in DB
  const handleStart = async () => {
    if (mode === "focus" && !activeSessionId.current) {
      try {
        const session = await startSession(settings.focusDuration, selectedProjectId || undefined);
        activeSessionId.current = session.id;
      } catch {
        // Proceed to start even if api fails
      }
    }
    start();
  };

  const handleReset = () => {
    activeSessionId.current = null;
    reset();
  };

  const handleSwitchMode = (newMode: TimerMode) => {
    activeSessionId.current = null;
    switchMode(newMode);
  };

  // When focus timer completes -> mark session as completed
  useEffect(() => {
    if (status !== "completed" || mode !== "focus") return;
    if (!activeSessionId.current) return;
    completeSession(activeSessionId.current)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["pomodoro-stats"] });
        setStatsRefreshKey((k) => k + 1);
      })
      .catch(() => {});
    activeSessionId.current = null;
  }, [status, mode]);

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* Header */}
      <div className="flex w-full max-w-sm items-center justify-between">
        <h1 className="text-2xl font-bold text-content">Pomodoro</h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className="text-content/50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-all hover:bg-surface hover:text-content"
        >
          <FontAwesomeIcon icon={faGear} />
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 rounded-xl bg-surface p-1">
        {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleSwitchMode(m)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              mode === m ? "bg-accent text-white shadow-soft" : "text-content hover:text-accent"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="relative">
        <TimerRing progress={progress} mode={mode} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-6xl font-bold tabular-nums text-content">{formatTime(secondsLeft)}</span>
          <span className="text-content/60 text-base">{MODE_LABELS[mode]}</span>
        </div>
      </div>

      {/* Controls */}
      <TimerControls status={status} onStart={handleStart} onPause={pause} onReset={handleReset} />

      {/* Project selector — only shown during focus mode */}
      {mode === "focus" && status === "idle" && (
        <ProjectSelector projects={projects} value={selectedProjectId} onChange={setSelectedProjectId} />
      )}

<StatsPanel refreshKey={statsRefreshKey} />

      {/* Settings panel */}
      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSave={(updated) => {
            updateSettings(updated);
            setSettingsOpen(false);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default Pomodoro;

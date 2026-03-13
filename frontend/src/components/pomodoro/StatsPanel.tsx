import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPomodoroStats } from "../../api/pomodoro.api";

type Period = "today" | "week" | "month";

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

interface Props {
  refreshKey?: number;
}

export const StatsPanel = ({ refreshKey }: Props) => {
  const [period, setPeriod] = useState<Period>("today");

  const { data: stats } = useQuery({
    queryKey: ["pomodoro-stats", period, refreshKey],
    queryFn: () => getPomodoroStats(period),
  });

  const maxMinutes = Math.max(...(stats?.byProject.map((p) => p.minutes) ?? [1]));

  return (
    <div className="w-full max-w-sm rounded-2xl bg-surface p-5">
      {/* Period tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-white p-1 dark:bg-gray-800">
        {(["today", "week", "month"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all duration-200 ${
              period === p ? "bg-accent text-white shadow-sm" : "text-content/60 hover:text-content"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-3 dark:bg-gray-800">
          <p className="text-2xl font-bold text-content">{stats?.totalSessions ?? 0}</p>
          <p className="text-content/50 text-xs">Sessions</p>
        </div>
        <div className="rounded-xl bg-white p-3 dark:bg-gray-800">
          <p className="text-2xl font-bold text-content">{stats?.totalMinutes ?? 0}</p>
          <p className="text-content/50 text-xs">Minutes focused</p>
        </div>
      </div>

      {/* By project */}
      {stats && stats.byProject.length > 0 ? (
        <div className="space-y-2.5">
          {stats.byProject.map((p) => (
            <div key={p.projectId}>
              <div className="mb-1 flex items-center justify-between">
                <span className="truncate text-xs text-content">{p.projectTitle}</span>
                <span className="text-content/50 ml-2 shrink-0 text-xs">{p.minutes}m</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white dark:bg-gray-800">
                <div
                  className="h-1.5 rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${(p.minutes / maxMinutes) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-content/40 text-center text-xs">No sessions yet</p>
      )}
    </div>
  );
};

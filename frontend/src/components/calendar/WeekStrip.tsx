import { faExternalLink, faPlus, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import type { CalendarGoal } from "../../types";
import { DAY_HEADERS } from "../../consts";
import { formatDayTitle, toDateKey } from "./calendarUtils";

interface WeekStripProps {
  weekDays: Date[];
  mobileDay: string;
  todayKey: string;
  goalsByDate: Record<string, CalendarGoal[]>;
  isLoading: boolean;
  onDaySelect: (key: string) => void;
  onAddGoal: (key: string) => void;
}

const WeekStrip = ({
  weekDays,
  mobileDay,
  todayKey,
  goalsByDate,
  isLoading,
  onDaySelect,
  onAddGoal,
}: WeekStripProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-surface-card">
        <div className="grid grid-cols-7 border-b border-border">
          {DAY_HEADERS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-content-muted"
            >
              {d.slice(0, 1)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {weekDays.map((day) => {
            const key = toDateKey(day);
            const isToday = key === todayKey;
            const isSelected = key === mobileDay;
            const hasGoals = (goalsByDate[key] ?? []).length > 0;
            return (
              <button
                key={key}
                onClick={() => onDaySelect(key)}
                className={`flex cursor-pointer flex-col items-center py-2 transition-all ${isSelected ? "bg-accent/5" : ""}`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    isToday && isSelected
                      ? "bg-accent text-white"
                      : isToday
                        ? "font-bold text-accent"
                        : isSelected
                          ? "bg-surface-hover text-content"
                          : "text-content"
                  }`}
                >
                  {day.getDate()}
                </span>
                <span
                  className={`mt-1 h-1 w-1 rounded-full transition-all ${hasGoals ? (isToday ? "bg-accent" : "bg-content-muted") : "bg-transparent"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="mb-3 text-sm font-semibold text-content-muted">{formatDayTitle(mobileDay)}</p>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-skeleton-light" />
          ))}
        </div>
      ) : (goalsByDate[mobileDay] ?? []).length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-content-muted">
          No goals scheduled for this day
        </div>
      ) : (
        <div className="space-y-2">
          {(goalsByDate[mobileDay] ?? []).map((goal) => (
            <button
              key={goal.id}
              onClick={() => navigate(`/project/${goal.project.id}`)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-card p-3 text-left transition-all hover:border-border-strong hover:shadow-sm"
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: goal.project.color }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${goal.isCompleted ? "text-content-muted line-through" : "text-content"}`}
                >
                  {goal.title}
                </p>
                <p className="text-xs text-content-muted">{goal.project.title}</p>
              </div>
              {goal.recurrence && (
                <FontAwesomeIcon icon={faRotate} className="shrink-0 text-xs text-content-muted" />
              )}
              <FontAwesomeIcon icon={faExternalLink} className="shrink-0 text-xs text-content-muted" />
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => onAddGoal(mobileDay)}
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong py-2.5 text-sm font-medium text-content-muted transition-all hover:border-accent hover:text-accent"
      >
        <FontAwesomeIcon icon={faPlus} className="text-xs" />
        Add goal
      </button>
    </>
  );
};

export default WeekStrip;

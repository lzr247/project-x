import { faExternalLink, faPlus, faRotate, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import type { CalendarGoal } from "../../types";
import { formatDayTitle } from "./calendarUtils";

interface DayDetailPanelProps {
  day: string;
  goals: CalendarGoal[];
  onClose: () => void;
  onGoalClick: (goal: CalendarGoal) => void;
  onAddGoal?: (date: Date) => void;
}

const DayDetailPanel = ({ day, goals, onClose, onGoalClick, onAddGoal }: DayDetailPanelProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-surface-card shadow-xl">
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-content">{formatDayTitle(day)}</h2>
              <p className="mt-0.5 text-sm text-content-muted">
                {goals.length} goal{goals.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={onClose} className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-surface">
              <FontAwesomeIcon icon={faTimes} className="text-content-muted" />
            </button>
          </div>

          {goals.length === 0 ? (
            <p className="py-6 text-center text-sm text-content-muted">No goals for this day</p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => onGoalClick(goal)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition-all hover:border-border-strong hover:shadow-sm"
                >
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: goal.project.color }} />
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
        </div>
        {/* Add goal button */}
        <div className="border-t border-border px-6 pb-6 pt-4">
          <button
            onClick={() => {
              const [year, month, d] = day.split("-").map(Number);
              onAddGoal?.(new Date(year, month - 1, d));
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong py-2.5 text-sm font-medium text-content-muted transition-all hover:border-accent hover:text-accent"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            Add goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayDetailPanel;

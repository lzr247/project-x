import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { DAY_HEADERS } from "../../consts";
import type { CalendarGoal } from "../../types";
import { toDateKey } from "./calendarUtils";
import GoalChip from "./GoalChip";

interface MonthGridProps {
  monthGridDays: Date[];
  currentMonth: number;
  goalsByDate: Record<string, CalendarGoal[]>;
  todayKey: string;
  isLoading: boolean;
  onDayClick: (key: string) => void;
  onEmptyCellClick: (key: string) => void;
}

const MonthGrid = ({
  monthGridDays,
  currentMonth,
  goalsByDate,
  todayKey,
  isLoading,
  onDayClick,
  onEmptyCellClick,
}: MonthGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-surface-card">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wide text-content-muted">
            {d}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse border-b border-r border-border bg-skeleton-light" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7">
          {monthGridDays.map((day, i) => {
            const key = toDateKey(day);
            const dayGoals = goalsByDate[key] ?? [];
            const isToday = key === todayKey;
            const inMonth = day.getMonth() === currentMonth;
            const isLastRow = i >= monthGridDays.length - 7;
            const isLastCol = (i + 1) % 7 === 0;

            return (
              <div
                key={key}
                onClick={() => (dayGoals.length === 0 ? onEmptyCellClick(key) : onDayClick(key))}
                className={`group min-h-32 cursor-pointer p-2 transition-colors ${!isLastRow ? "border-b" : ""} ${!isLastCol ? "border-r" : ""} border-border ${inMonth ? "hover:bg-surface-hover/30 bg-surface-card" : "bg-surface/50 hover:bg-surface/70"}`}
              >
                <div className="mb-1.5 flex items-center justify-end gap-1">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="invisible text-[10px] text-content-muted group-hover:visible"
                  />
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                      isToday ? "bg-accent text-white" : inMonth ? "text-content" : "text-content-muted opacity-40"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayGoals.slice(0, 3).map((goal) => (
                    <GoalChip key={goal.id} goal={goal} onClick={() => navigate(`/project/${goal.project.id}`)} />
                  ))}
                  {dayGoals.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDayClick(key);
                      }}
                      className="w-full cursor-pointer px-1 text-left text-xs font-medium text-accent hover:underline"
                    >
                      +{dayGoals.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonthGrid;

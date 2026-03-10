import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCalendarGoals } from "../api/projects.api";
import DayDetailPanel from "../components/calendar/DayDetailPanel";
import MonthGrid from "../components/calendar/MonthGrid";
import WeekStrip from "../components/calendar/WeekStrip";
import { MONTH_NAMES } from "../consts";
import { getMonthGridDays, getWeekDays, toDateKey } from "../components/calendar/calendarUtils";

const Calendar = () => {
  const navigate = useNavigate();
  const todayKey = toDateKey(new Date());

  const [current, setCurrent] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [mobileDay, setMobileDay] = useState(todayKey);

  const weekDays = getWeekDays(current);
  const monthGridDays = getMonthGridDays(current.getFullYear(), current.getMonth());

  const startDate = toDateKey(monthGridDays[0]);
  const endDate = toDateKey(monthGridDays[monthGridDays.length - 1]);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["calendar", startDate, endDate],
    queryFn: () => getCalendarGoals(startDate, endDate),
  });

  const goalsByDate = goals.reduce<Record<string, (typeof goals)[0][]>>((acc, goal) => {
    const key = goal.dueDate!.split("T")[0];
    acc[key] = [...(acc[key] ?? []), goal];
    return acc;
  }, {});

  // Navigation
  const prev = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const goToday = () => {
    setCurrent(new Date());
    setMobileDay(todayKey);
  };

  const navigateMobileWeek = (dir: number) => {
    setCurrent((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + dir * 7);
      const newWeek = getWeekDays(n);
      const todayInWeek = newWeek.some((w) => toDateKey(w) === todayKey);
      setMobileDay(todayInWeek ? todayKey : toDateKey(newWeek[0]));
      return n;
    });
  };

  const title = `${MONTH_NAMES[current.getMonth()]} ${current.getFullYear()}`;

  return (
    <div className="min-h-full">
      {/* Desktop header */}
      <div className="mb-6 hidden items-center justify-between md:flex">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-content">{title}</h1>
          <button
            onClick={goToday}
            className="cursor-pointer rounded-lg border border-border-strong px-3 py-1 text-sm font-medium text-content-muted transition-all hover:border-accent hover:text-accent"
          >
            Today
          </button>
        </div>
        <div className="flex">
          <button
            onClick={prev}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-l-lg border border-border-strong text-content-muted transition-all hover:bg-surface-hover hover:text-content"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
          </button>
          <button
            onClick={next}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-border-strong text-content-muted transition-all hover:bg-surface-hover hover:text-content"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="mb-3 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-content">{title}</h1>
          <button
            onClick={goToday}
            className="cursor-pointer rounded-lg border border-border-strong px-2 py-0.5 text-xs font-medium text-content-muted transition-all hover:border-accent hover:text-accent"
          >
            Today
          </button>
        </div>
        <div className="flex">
          <button
            onClick={() => navigateMobileWeek(-1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-lg border border-border-strong text-content-muted transition-all hover:bg-surface-hover"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
          <button
            onClick={() => navigateMobileWeek(1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-border-strong text-content-muted transition-all hover:bg-surface-hover"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>
      </div>

      {/* Mobile: Week strip + Day list */}
      <div className="md:hidden">
        <WeekStrip
          weekDays={weekDays}
          mobileDay={mobileDay}
          todayKey={todayKey}
          goalsByDate={goalsByDate}
          isLoading={isLoading}
          onDaySelect={setMobileDay}
        />
      </div>

      {/* Desktop: Month grid */}
      <div className="hidden md:block">
        <MonthGrid
          monthGridDays={monthGridDays}
          currentMonth={current.getMonth()}
          goalsByDate={goalsByDate}
          todayKey={todayKey}
          isLoading={isLoading}
          onDayClick={setSelectedDay}
        />
      </div>

      {/* Day detail modal */}
      {selectedDay && (
        <DayDetailPanel
          day={selectedDay}
          goals={goalsByDate[selectedDay] ?? []}
          onClose={() => setSelectedDay(null)}
          onGoalClick={(goal) => {
            navigate(`/project/${goal.project.id}`);
            setSelectedDay(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

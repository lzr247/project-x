import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CalendarGoal } from "../../types";

interface GoalChipProps {
  goal: CalendarGoal;
  onClick: () => void;
}

const GoalChip = ({ goal, onClick }: GoalChipProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    title={goal.recurrence === "DAILY" ? "Daily recurrence" : goal.recurrence === "WEEKLY" ? "Weekly recurrence" : goal.recurrence === "MONTHLY" ? "Monthly recurrence" : undefined}
    className={`flex w-full cursor-pointer items-center gap-1 truncate rounded px-1.5 py-0.5 text-left text-xs transition-opacity hover:opacity-80 ${goal.isCompleted ? "opacity-50" : ""}`}
    style={{ backgroundColor: `${goal.project.color}20`, color: goal.project.color }}
  >
    {goal.recurrence && (
      <span className="flex shrink-0 items-center gap-0.5 opacity-75">
        <FontAwesomeIcon icon={faRotate} className="text-[9px]" />
        <span className="text-[9px] font-semibold leading-none">
          {goal.recurrence === "DAILY" ? "D" : goal.recurrence === "WEEKLY" ? "W" : "M"}
        </span>
      </span>
    )}
    <span className={`truncate font-medium ${goal.isCompleted ? "line-through" : ""}`}>{goal.title}</span>
  </button>
);

export default GoalChip;

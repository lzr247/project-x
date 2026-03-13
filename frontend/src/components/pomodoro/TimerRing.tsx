interface TimerRingProps {
  progress: number; // 0 to 1
  mode: "focus" | "shortBreak" | "longBreak";
}

const MODE_COLOR: Record<TimerRingProps["mode"], string> = {
  focus: "var(--color-accent)",
  shortBreak: "#22c55e",
  longBreak: "#a855f7",
};

const SIZE = 300;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TimerRing = ({ progress, mode }: TimerRingProps) => {
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <svg width={SIZE} height={SIZE} className="-rotate-90">
      {/* bg track */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        className="text-surface"
      />
      {/* progress arc */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={MODE_COLOR[mode]}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
};

export default TimerRing;

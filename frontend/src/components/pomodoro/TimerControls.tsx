import { faPause, faPlay, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TimerStatus } from "../../types";

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const TimerControls = ({ status, onStart, onPause, onReset }: TimerControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onReset}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-surface text-content transition-all duration-200 hover:bg-accent hover:text-white"
        title="Reset"
      >
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>

      <button
        onClick={status === "running" ? onPause : onStart}
        className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-soft transition-all duration-200 hover:scale-105 hover:brightness-110"
      >
        <FontAwesomeIcon icon={status === "running" ? faPause : faPlay} size="lg" />
      </button>

      {/* spacer to keep play button centered */}
      <div className="h-12 w-12" />
    </div>
  );
};

export default TimerControls;

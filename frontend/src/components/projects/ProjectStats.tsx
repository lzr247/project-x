import { faBullseye, faChartSimple, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProjectStatsProps {
  totalGoals: number;
  completedGoals: number;
  progress: number;
  color: string;
}

const ProjectStats = ({ totalGoals, completedGoals, progress, color }: ProjectStatsProps) => {
  if (totalGoals === 0) return null;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              <FontAwesomeIcon icon={faBullseye} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-content">{totalGoals}</p>
              <p className="text-xs text-content-muted">Total Goals</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faCheck} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-content">{completedGoals}</p>
              <p className="text-xs text-content-muted">Completed</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              <FontAwesomeIcon icon={faChartSimple} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-content">{Math.round(progress)}%</p>
              <p className="text-xs text-content-muted">Progress</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-hover">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ProjectStats;

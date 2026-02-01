import {
  faBullseye,
  faCheckCircle,
  faEllipsisV,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const completedGoals = project._count?.completedGoals || 0;
  const totalGoals = project._count?.goals || 0;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-full">
      {/* Color bar */}
      <div
        className="h-1.5 transition-all duration-300 group-hover:h-2 shrink-0"
        style={{ backgroundColor: project.color }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${project.color}15` }}
          >
            <FontAwesomeIcon
              icon={faFolder}
              className="text-lg"
              style={{ color: project.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-content group-hovere:text-accent transition-colors">
              {project.title}
            </h3>
            {project.isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
            )}
          </div>

          {/* Menu button */}
          <button className="cursor-pointer p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface transition-all">
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="text-content-muted"
            />
          </button>
        </div>

        {/* Description  */}
        <div className="flex-1 min-h-10 mb-4">
          <p className="text-sm text-content-secondary line-clamp-2">
            {project.description || <i>No description</i>}
          </p>
        </div>

        {/* Goals progress */}
        <div className="mt-auto">
          {totalGoals > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-content-secondary flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faBullseye}
                    className="text-content-muted"
                  />
                  Goals
                </span>
                <span className="font-medium text-content">
                  {completedGoals}/{totalGoals}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: project.color,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Empty state for goals */}
        {totalGoals === 0 && (
          <div className="mt-4 py-2 px-3 bg-surface rounded-lg">
            <p className="text-xs text-content-muted text-center">
              No goals defined
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

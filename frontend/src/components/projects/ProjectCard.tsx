import { faBullseye, faCheckCircle, faEllipsisV, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const completedGoals = project._count?.completedGoals || 0;
  const totalGoals = project._count?.goals || 0;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <Link
      to={`/project/${project.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-all duration-300 hover:border-gray-200 hover:shadow-card-hover"
    >
      {/* Color bar */}
      <div
        className="h-1.5 shrink-0 transition-all duration-300 group-hover:scale-y-[1.6]"
        style={{ backgroundColor: project.color }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${project.color}15` }}
          >
            <FontAwesomeIcon icon={faFolder} className="text-lg" style={{ color: project.color }} />
          </div>
          <div>
            <h3 className="group-hovere:text-accent font-semibold text-content transition-colors">{project.title}</h3>
            {project.isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
            )}
          </div>

          {/* Menu button */}
          <button className="cursor-pointer rounded-lg p-2 opacity-0 transition-all hover:bg-surface group-hover:opacity-100">
            <FontAwesomeIcon icon={faEllipsisV} className="text-content-muted" />
          </button>
        </div>

        {/* Description  */}
        <div className="mb-4 min-h-10 flex-1">
          <p className="line-clamp-2 text-sm text-content-secondary">{project.description || <i>No description</i>}</p>
        </div>

        {/* Goals progress */}
        <div className="mt-auto">
          {totalGoals > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-content-secondary">
                  <FontAwesomeIcon icon={faBullseye} className="text-content-muted" />
                  Goals
                </span>
                <span className="font-medium text-content">
                  {completedGoals}/{totalGoals}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
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
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-content-secondary">
                <FontAwesomeIcon icon={faBullseye} className="text-content-muted" />
                Goals
              </span>
              <span className="font-medium text-content-muted">0/0</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;

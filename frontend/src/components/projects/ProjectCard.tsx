import { faBullseye } from "@fortawesome/free-solid-svg-icons";
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-card shadow-card transition-all duration-300 hover:border-border-strong hover:shadow-card-hover"
    >
      {/* Color bar */}
      <div
        className="h-1.5 shrink-0 transition-all duration-300 group-hover:scale-y-[1.6]"
        style={{ backgroundColor: project.color }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Title + Status */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-content transition-colors group-hover:text-accent">{project.title}</h3>
          {project.status !== "ACTIVE" && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                project.status === "COMPLETED"
                  ? "bg-success/10 text-success"
                  : project.status === "ON_HOLD"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-danger/10 text-danger"
              }`}
            >
              {project.status === "COMPLETED" ? "Completed" : project.status === "ON_HOLD" ? "On Hold" : "Cancelled"}
            </span>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="mb-3 line-clamp-2 text-sm text-content-secondary">{project.description}</p>
        )}

        {/* Created date */}
        <p className="mt-auto text-xs text-content-muted">
          {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>

        {/* Goals progress */}
        <div className="mt-3 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-content-secondary">
            <FontAwesomeIcon icon={faBullseye} className="text-content-muted" />
            <span className="font-medium text-content">
              {completedGoals}/{totalGoals}
            </span>
            goals
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: project.color,
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;

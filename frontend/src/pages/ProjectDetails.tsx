import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getProjectById } from "../api/projects.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBullseye,
  faExclamationTriangle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
    enabled: !!id,
  });
  console.log(project);

  if (isLoading) {
    return (
      <div className="min-h-full">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-6 w-24 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded-lg bg-gray-100" />
        </div>
        {/* Goals skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-2xl text-danger"
          />
        </div>
        <p className="mb-4 text-content-secondary">Project not found</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to projects
        </Link>
      </div>
    );
  }

  const completedGoals =
    project?.goals.filter((goal) => goal.isCompleted).length ?? 0;
  const totalGoals = project?.goals.length ?? 0;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="min-h-full">
      {/* Back link */}
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-content-secondary transition-colors hover:text-accent"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to projects
      </Link>

      {/* Project header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <div className="h-2" style={{ backgroundColor: project.color }} />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${project.color}15` }}
              >
                <FontAwesomeIcon
                  icon={faBullseye}
                  className="text-2xl"
                  style={{ color: project.color }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-content">
                  {project.title}
                </h1>
                {project.description && (
                  <p className="mt-1 text-content-secondary">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {totalGoals > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-content-secondary">Progress</span>
                <span className="font-medium text-content">
                  {completedGoals} of {totalGoals} goals completed
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
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
      </div>

      {/* Goals section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-content">Goals</h2>
        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md"
        >
          <FontAwesomeIcon icon={faPlus} /> Add goal
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;

import {
  faArrowLeft,
  faBullseye,
  faCalendarAlt,
  faChartSimple,
  faCheck,
  faEllipsisV,
  faExclamationTriangle,
  faPause,
  faPlay,
  faPlus,
  faTrash,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteGoal, deleteProject, getProjectById, updateGoal, updateProject } from "../api/projects.api";
import AddGoalModal from "../components/modals/AddGoalModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import type { Goal, ProjectStatus } from "../types";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
    enabled: !!id,
  });

  const toggleGoalMutation = useMutation({
    mutationFn: ({ goalId, isCompleted }: { goalId: string; isCompleted: boolean }) =>
      updateGoal(goalId, { isCompleted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to update goal");
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Goal deleted");
      setGoalToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete goal");
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
      navigate("/projects");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: ProjectStatus) => updateProject(id!, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project status updated");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => updateProject(id!, { isArchived: !project?.isArchived }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(project?.isArchived ? "Project unarchived" : "Project archived");
    },
  });

  const handleToggleGoal = (goal: Goal) => {
    toggleGoalMutation.mutate({ goalId: goal.id, isCompleted: !goal.isCompleted });
  };

  const handleDeleteGoal = () => {
    if (goalToDelete) {
      deleteGoalMutation.mutate(goalToDelete.id);
    }
  };

  const handleDeleteProject = () => {
    deleteProjectMutation.mutate(id!);
  };

  if (isLoading) {
    return (
      <div className="min-h-full">
        <div className="mb-6 h-5 w-28 animate-pulse rounded-lg bg-gray-200" />
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
          <div>
            <div className="h-7 w-56 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded-lg bg-gray-100" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded-lg bg-gray-100" />
          </div>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="mb-4 h-5 w-16 animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-18 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-danger" />
        </div>
        <p className="mb-4 text-content-secondary">Project not found</p>
        <Link to="/projects" className="inline-flex items-center gap-2 text-accent hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to projects
        </Link>
      </div>
    );
  }

  const completedGoals = project?.goals.filter((goal) => goal.isCompleted).length ?? 0;
  const totalGoals = project?.goals.length ?? 0;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const sortedGoals = [...(project?.goals ?? [])].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return Number(a.isCompleted) - Number(b.isCompleted);
    if (a.isCompleted && b.isCompleted) {
      return new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const incompleteGoals = sortedGoals.filter((g) => !g.isCompleted);
  const completedGoalsList = sortedGoals.filter((g) => g.isCompleted);

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

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${project.color}15` }}
            >
              <FontAwesomeIcon icon={faBullseye} className="text-xl" style={{ color: project.color }} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-content">{project.title}</h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    project.status === "ACTIVE"
                      ? "bg-accent/10 text-accent"
                      : project.status === "COMPLETED"
                        ? "bg-success/10 text-success"
                        : project.status === "ON_HOLD"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-danger/10 text-danger"
                  }`}
                >
                  {project.status === "ACTIVE"
                    ? "Active"
                    : project.status === "COMPLETED"
                      ? "Completed"
                      : project.status === "ON_HOLD"
                        ? "On Hold"
                        : "Cancelled"}
                </span>
                {project.isArchived && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-content-muted">
                    Archived
                  </span>
                )}
              </div>
              {project.description && <p className="mt-1 text-content-secondary">{project.description}</p>}
              <div className="mt-2 flex items-center gap-3 text-xs text-content-muted">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Created{" "}
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>·</span>
                <span>
                  {totalGoals} {totalGoals === 1 ? "goal" : "goals"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {project.status !== "COMPLETED" && (
              <button
                onClick={() => updateStatusMutation.mutate("COMPLETED")}
                className="cursor-pointer rounded-xl border border-success/20 bg-success/5 px-4 py-2 text-sm font-medium text-success transition-all hover:bg-success/10"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Complete
              </button>
            )}
            {project.status !== "ON_HOLD" && (
              <button
                onClick={() => updateStatusMutation.mutate("ON_HOLD")}
                className="cursor-pointer rounded-xl border border-yellow-300/50 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 transition-all hover:bg-yellow-100"
              >
                <FontAwesomeIcon icon={faPause} className="mr-2" />
                On Hold
              </button>
            )}
            {(project.status === "COMPLETED" || project.status === "ON_HOLD") && (
              <button
                onClick={() => updateStatusMutation.mutate("ACTIVE")}
                className="cursor-pointer rounded-xl border border-accent/20 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/10"
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Reactivate
              </button>
            )}

            {/* Dropdown menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-2.5 text-content-secondary transition-all hover:bg-surface-hover"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-card-hover">
                    <button
                      onClick={() => {
                        archiveMutation.mutate();
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-content-secondary transition-colors hover:bg-surface"
                    >
                      <FontAwesomeIcon icon={faArchive} className="w-4" />
                      {project.isArchived ? "Unarchive" : "Archive"}
                    </button>
                    <div className="mx-3 my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        setIsDeleteProjectModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-danger/5"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4" />
                      Delete project
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      {totalGoals > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${project.color}15` }}
                >
                  <FontAwesomeIcon icon={faBullseye} style={{ color: project.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-content">{totalGoals}</p>
                  <p className="text-xs text-content-muted">Total Goals</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <FontAwesomeIcon icon={faCheck} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-content">{completedGoals}</p>
                  <p className="text-xs text-content-muted">Completed</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${project.color}15` }}
                >
                  <FontAwesomeIcon icon={faChartSimple} style={{ color: project.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-content">{Math.round(progress)}%</p>
                  <p className="text-xs text-content-muted">Progress</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: project.color }}
            />
          </div>
        </div>
      )}

      {/* Goals section header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold text-content">Goals</h2>
        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md"
        >
          <FontAwesomeIcon icon={faPlus} /> Add goal
        </button>
      </div>

      {/* Goals list */}
      {project.goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-surface/50 py-16">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${project.color}15` }}
          >
            <FontAwesomeIcon icon={faBullseye} className="text-2xl" style={{ color: project.color }} />
          </div>
          <h3 className="mb-2 font-semibold text-content">No goals yet</h3>
          <p className="mb-4 text-sm text-content-secondary">Add your first goal to start tracking progress</p>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-accent-hover"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add First Goal
          </button>
        </div>
      ) : (
        <div>
          {/* Incomplete goals */}
          {incompleteGoals.length > 0 && (
            <div className="space-y-2">
              {incompleteGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-sm"
                >
                  <button
                    onClick={() => handleToggleGoal(goal)}
                    disabled={toggleGoalMutation.isPending}
                    className="mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all hover:scale-110"
                    style={{ borderColor: project.color + "60" }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-content">{goal.title}</h3>
                    {goal.description && <p className="mt-0.5 text-sm text-content-secondary">{goal.description}</p>}
                    <p className="mt-1.5 text-xs text-content-muted">
                      Added{" "}
                      {new Date(goal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={() => setGoalToDelete(goal)}
                    className="cursor-pointer rounded-lg p-2 text-content-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Completed divider */}
          {completedGoalsList.length > 0 && incompleteGoals.length > 0 && (
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="flex items-center gap-2 text-xs font-medium text-content-muted">
                <FontAwesomeIcon icon={faCheck} className="text-success" />
                Completed ({completedGoalsList.length})
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          )}

          {/* Completed goals */}
          {completedGoalsList.length > 0 && (
            <div className="space-y-2">
              {incompleteGoals.length === 0 && (
                <p className="mb-3 flex items-center gap-2 text-xs font-medium text-content-muted">
                  <FontAwesomeIcon icon={faCheck} className="text-success" />
                  Completed ({completedGoalsList.length})
                </p>
              )}
              {completedGoalsList.map((goal) => (
                <div
                  key={goal.id}
                  className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all"
                >
                  <button
                    onClick={() => handleToggleGoal(goal)}
                    disabled={toggleGoalMutation.isPending}
                    className="mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-success bg-success text-white transition-all hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-content-muted line-through">{goal.title}</h3>
                    {goal.description && <p className="mt-0.5 text-sm text-content-muted">{goal.description}</p>}
                    {goal.completedAt && (
                      <p className="mt-1.5 text-xs text-content-muted">
                        Completed{" "}
                        {new Date(goal.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setGoalToDelete(goal)}
                    className="cursor-pointer rounded-lg p-2 text-content-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add goal modal */}
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        projectId={id!}
        projectColor={project.color}
      />

      {/* Delete Project Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? All goals will be permanently deleted as well."
        confirmText="Delete"
        icon={faTrash}
        variant="danger"
        isLoading={deleteProjectMutation.isPending}
      />

      {/* Delete Goal Confirmation Modal */}
      <ConfirmModal
        isOpen={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteGoal}
        title="Delete Goal"
        message={`Are you sure you want to delete "${goalToDelete?.title}"?`}
        confirmText="Delete"
        icon={faTrash}
        variant="danger"
        isLoading={deleteGoalMutation.isPending}
      />
    </div>
  );
};

export default ProjectDetails;

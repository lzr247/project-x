import {
  faArrowLeft,
  faBullseye,
  faCheck,
  faExclamationTriangle,
  faPlus,
  faTrash,
  faArchive,
  faPause,
  faBan,
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
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-6 w-24 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded-lg bg-gray-100" />
        </div>
        {/* Goals skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
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
                <FontAwesomeIcon icon={faBullseye} className="text-2xl" style={{ color: project.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-content">{project.title}</h1>
                {project.description && <p className="mt-1 text-content-secondary">{project.description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status buttons */}
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
              {project.status === "COMPLETED" || project.status === "ON_HOLD" ? (
                <button
                  onClick={() => updateStatusMutation.mutate("ACTIVE")}
                  className="cursor-pointer rounded-xl border border-accent/20 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/10"
                >
                  Reactivate
                </button>
              ) : null}

              {/* Archive button */}
              <button
                onClick={() => archiveMutation.mutate()}
                className="cursor-pointer rounded-xl border border-gray-200 bg-surface px-4 py-2 text-sm font-medium text-content-secondary transition-all hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faArchive} className="mr-2" />
                {project.isArchived ? "Unarchive" : "Archive"}
              </button>

              {/* Delete project button */}
              <button
                onClick={() => setIsDeleteProjectModalOpen(true)}
                className="cursor-pointer rounded-xl border border-danger/20 bg-danger/5 px-4 py-2 text-sm font-medium text-danger transition-all hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete Project
              </button>
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
        <div className="space-y-3">
          {project.goals.map((goal) => (
            <div
              key={goal.id}
              className={`group flex items-center gap-4 rounded-xl border bg-white p-4 transition-all ${
                goal.isCompleted
                  ? "border-gray-100 bg-gray-50/50"
                  : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggleGoal(goal)}
                disabled={toggleGoalMutation.isPending}
                className={`flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all ${
                  goal.isCompleted ? "border-success bg-success text-white" : "border-gray-300 hover:border-accent"
                }`}
                style={goal.isCompleted ? {} : { borderColor: project.color + "60" }}
              >
                {goal.isCompleted && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
              </button>

              {/* Goal content */}
              <div className="flex-1">
                <h3 className={`font-medium ${goal.isCompleted ? "text-content-muted line-through" : "text-content"}`}>
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className={`mt-0.5 text-sm ${goal.isCompleted ? "text-content-muted" : "text-content-secondary"}`}>
                    {goal.description}
                  </p>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={() => setGoalToDelete(goal)}
                className="cursor-pointer rounded-lg p-2 text-content-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
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

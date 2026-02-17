import type { DragEndEvent } from "@dnd-kit/core";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  faArrowLeft,
  faBullseye,
  faCheck,
  faExclamationTriangle,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearCompletedGoals,
  deleteGoal,
  deleteProject,
  getProjectById,
  reorderGoals,
  updateGoal,
  updateProject,
} from "../api/projects.api";
import GoalItem from "../components/goals/GoalItem";
import AddGoalModal from "../components/modals/AddGoalModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import ProjectHeader from "../components/projects/ProjectHeader";
import ProjectStats from "../components/projects/ProjectStats";
import type { Goal, ProjectStatus, ProjectWithGoals } from "../types";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [isClearCompletedModalOpen, setIsClearCompletedModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const updateDescriptionMutation = useMutation({
    mutationFn: (description: string) => updateProject(id!, { description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to update description");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; order: number }[]) => reorderGoals(id!, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
    onError: () => {
      toast.error("Failed to reorder goals");
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
  });

  const clearCompletedMutation = useMutation({
    mutationFn: () => clearCompletedGoals(id!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(`${data.count} completed goal(s) cleared`);
      setIsClearCompletedModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to clear completed goals");
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = incompleteGoals.findIndex((g) => g.id === active.id);
    const newIndex = incompleteGoals.findIndex((g) => g.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...incompleteGoals];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const items = reordered.map((g, i) => ({ id: g.id, order: i }));

    // Optimistic update
    queryClient.setQueryData(["project", id], (old: ProjectWithGoals | undefined) => {
      if (!old) return old;
      const updatedGoals = old.goals.map((g) => {
        const match = items.find((item) => item.id === g.id);
        return match ? { ...g, order: match.order } : g;
      });
      return { ...old, goals: updatedGoals };
    });

    reorderMutation.mutate(items);
  };

  if (isLoading) {
    return (
      <div className="min-h-full">
        <div className="mb-6 h-5 w-28 animate-pulse rounded-lg bg-skeleton" />
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-skeleton" />
          <div>
            <div className="h-7 w-56 animate-pulse rounded-lg bg-skeleton" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded-lg bg-skeleton-light" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded-lg bg-skeleton-light" />
          </div>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-skeleton-light" />
          ))}
        </div>
        <div className="mb-4 h-5 w-16 animate-pulse rounded-lg bg-skeleton" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-18 animate-pulse rounded-xl bg-skeleton-light" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center py-20">
        <div className="bg-danger/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
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

  const completedGoals = project.goals.filter((goal) => goal.isCompleted).length;
  const totalGoals = project.goals.length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const sortedGoals = [...project.goals].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return Number(a.isCompleted) - Number(b.isCompleted);
    if (a.isCompleted && b.isCompleted) {
      return new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime();
    }
    return a.order - b.order;
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

      <ProjectHeader
        project={project}
        totalGoals={totalGoals}
        onUpdateStatus={(status) => updateStatusMutation.mutate(status)}
        onArchive={() => archiveMutation.mutate()}
        onDeleteProject={() => setIsDeleteProjectModalOpen(true)}
        onUpdateDescription={(desc) => updateDescriptionMutation.mutate(desc)}
      />

      <ProjectStats totalGoals={totalGoals} completedGoals={completedGoals} progress={progress} color={project.color} />

      {/* Goals section header */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
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
        <div className="bg-surface/50 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong py-16">
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
          {/* Incomplete goals with drag & drop */}
          {incompleteGoals.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={incompleteGoals.map((g) => g.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {incompleteGoals.map((goal) => (
                    <GoalItem
                      key={goal.id}
                      goal={goal}
                      projectId={id!}
                      projectColor={project.color}
                      onToggle={handleToggleGoal}
                      onDelete={setGoalToDelete}
                      isToggling={toggleGoalMutation.isPending}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Completed divider */}
          {completedGoalsList.length > 0 && incompleteGoals.length > 0 && (
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="flex items-center gap-2 text-xs font-medium text-content-muted">
                <FontAwesomeIcon icon={faCheck} className="text-success" />
                Completed ({completedGoalsList.length})
              </span>
              <button
                onClick={() => setIsClearCompletedModalOpen(true)}
                className="cursor-pointer text-xs font-medium text-content-muted transition-colors hover:text-danger"
              >
                Clear all
              </button>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          {/* Completed goals */}
          {completedGoalsList.length > 0 && (
            <div className="space-y-2">
              {incompleteGoals.length === 0 && (
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs font-medium text-content-muted">
                    <FontAwesomeIcon icon={faCheck} className="text-success" />
                    Completed ({completedGoalsList.length})
                  </p>
                  <button
                    onClick={() => setIsClearCompletedModalOpen(true)}
                    className="cursor-pointer text-xs font-medium text-content-muted transition-colors hover:text-danger"
                  >
                    Clear all
                  </button>
                </div>
              )}
              {completedGoalsList.map((goal) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  projectId={id!}
                  projectColor={project.color}
                  onToggle={handleToggleGoal}
                  onDelete={setGoalToDelete}
                  isToggling={toggleGoalMutation.isPending}
                />
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
        onConfirm={() => deleteProjectMutation.mutate(id!)}
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

      {/* Clear Completed Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearCompletedModalOpen}
        onClose={() => setIsClearCompletedModalOpen(false)}
        onConfirm={() => clearCompletedMutation.mutate()}
        title="Clear Completed Goals"
        message={`Are you sure you want to delete all ${completedGoalsList.length} completed goal(s)? This cannot be undone.`}
        confirmText="Clear All"
        icon={faTrash}
        variant="danger"
        isLoading={clearCompletedMutation.isPending}
      />
    </div>
  );
};

export default ProjectDetails;

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faCheck, faGripVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { updateGoal } from "../../api/projects.api";
import type { Goal } from "../../types";
import RichTextEditor, { stripHtml } from "../common/RichTextEditor";

interface GoalItemProps {
  goal: Goal;
  projectId: string;
  projectColor: string;
  onToggle: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  isToggling: boolean;
}

const GoalItem = ({ goal, projectId, projectColor, onToggle, onDelete, isToggling }: GoalItemProps) => {
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: goal.id,
    disabled: goal.isCompleted,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const editMutation = useMutation({
    mutationFn: ({ title, description }: { title: string; description?: string }) =>
      updateGoal(goal.id, { title, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Failed to update goal");
    },
  });

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.selectionStart = titleRef.current.value.length;
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setTitleDraft(goal.title);
    setDescriptionDraft(goal.description || "");
    setValidationError(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedTitle = titleDraft.trim();
    if (!trimmedTitle) {
      setValidationError("Title is required");
      return;
    }
    if (trimmedTitle.length > 30) {
      setValidationError("Title must be 30 characters or less");
      return;
    }
    const plainDescription = stripHtml(descriptionDraft);
    if (plainDescription.length > 500) {
      setValidationError("Description must be 500 characters or less");
      return;
    }
    editMutation.mutate({
      title: trimmedTitle,
      description: plainDescription ? descriptionDraft : undefined,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationError(null);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 rounded-xl border border-border p-4 transition-all ${
        goal.isCompleted ? "bg-surface/50" : "bg-surface-card hover:border-border-strong hover:shadow-sm"
      } ${isDragging ? "z-10 opacity-50 shadow-lg" : ""}`}
    >
      {/* Drag handle */}
      {!goal.isCompleted && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-content-muted opacity-0 transition-opacity hover:text-content active:cursor-grabbing group-hover:opacity-100"
        >
          <FontAwesomeIcon icon={faGripVertical} className="text-sm" />
        </button>
      )}

      {/* Checkbox */}
      {goal.isCompleted ? (
        <button
          onClick={() => onToggle(goal)}
          disabled={isToggling}
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-success bg-success text-white transition-all hover:scale-110"
        >
          <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
        </button>
      ) : (
        <button
          onClick={() => onToggle(goal)}
          disabled={isToggling}
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all hover:scale-110"
          style={{ borderColor: projectColor + "60" }}
        />
      )}

      {/* Content */}
      {isEditing ? (
        <div className="min-w-0 flex-1">
          <input
            ref={titleRef}
            value={titleDraft}
            onChange={(e) => {
              setTitleDraft(e.target.value);
              setValidationError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
              if (e.key === "Escape") handleCancel();
            }}
            maxLength={30}
            className="focus:ring-accent/20 w-full rounded-lg border border-border-strong bg-surface-card px-3 py-1.5 text-sm font-medium text-content outline-none transition-all focus:border-accent focus:ring-2"
          />
          <div className="mt-2">
            <RichTextEditor
              content={descriptionDraft}
              onChange={(html) => {
                setDescriptionDraft(html);
                setValidationError(null);
              }}
              placeholder="Description (optional)"
              maxLength={500}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancel();
              }}
            />
          </div>
          {validationError && <p className="mt-1 text-xs text-danger">{validationError}</p>}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={editMutation.isPending}
              className="cursor-pointer rounded-lg bg-accent px-3 py-1 text-xs font-medium text-white transition-all hover:bg-accent-hover disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer rounded-lg px-3 py-1 text-xs font-medium text-content-muted transition-all hover:text-content"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="min-w-0 flex-1 cursor-pointer" onClick={handleStartEdit}>
          <h3 className={`font-medium ${goal.isCompleted ? "text-content-muted line-through" : "text-content"}`}>
            {goal.title}
          </h3>
          {goal.description ? (
            <div
              className={`rich-text-content mt-0.5 text-sm ${goal.isCompleted ? "text-content-muted" : "text-content-secondary"}`}
              dangerouslySetInnerHTML={{ __html: goal.description }}
            />
          ) : (
            !goal.isCompleted && (
              <p className="mt-0.5 text-sm italic text-content-muted opacity-0 transition-opacity group-hover:opacity-100">
                Add description...
              </p>
            )
          )}
          {goal.isCompleted && goal.completedAt ? (
            <p className="mt-1.5 text-xs text-content-muted">
              Completed {new Date(goal.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-content-muted">
              Added {new Date(goal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          )}
        </div>
      )}

      {/* Delete */}
      <button
        onClick={() => onDelete(goal)}
        className="hover:bg-danger/10 cursor-pointer rounded-lg p-2 text-content-muted opacity-0 transition-all hover:text-danger group-hover:opacity-100"
      >
        <FontAwesomeIcon icon={faTrash} className="text-sm" />
      </button>
    </div>
  );
};

export default GoalItem;

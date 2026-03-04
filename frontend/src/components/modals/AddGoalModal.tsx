import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createGoal } from "../../api/projects.api";
import type { CreateGoalRequest, Recurrence } from "../../types";
import DatePicker from "../common/DatePicker";
import RichTextEditor, { stripHtml } from "../common/RichTextEditor";
import Modal from "./Modal";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectColor: string;
}

const AddGoalModal = ({ isOpen, onClose, projectId, projectColor }: AddGoalModalProps) => {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<Recurrence | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalRequest>({
    defaultValues: {
      title: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateGoalRequest) => createGoal(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Goal added successfully!");
      reset();
      setDescription("");
      setDueDate(null);
      setRecurrence(null);
      onClose();
    },
    onError: () => {
      toast.error("Failed to add goal");
    },
  });

  const descriptionError = stripHtml(description).length > 500 ? "Maximum 500 characters" : null;

  const onSubmit = (data: CreateGoalRequest) => {
    if (descriptionError) return;
    const plainDescription = stripHtml(description);
    mutation.mutate({
      ...data,
      description: plainDescription ? description : undefined,
      dueDate: dueDate ?? undefined,
      recurrence: recurrence ?? undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Goal" size="md" colorBar={projectColor}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Goal title <span className="text-xs text-danger">*</span>
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              minLength: { value: 1, message: "Title is required" },
              maxLength: { value: 30, message: "Maximum 30 characters" },
            })}
            type="text"
            placeholder="Enter goal title"
            className="focus:ring-accent/20 w-full rounded-xl border border-border-strong bg-surface-card px-4 py-3 text-content outline-none transition-all focus:border-accent focus:ring-2"
          />
          {errors.title && <p className="mt-1 text-sm text-danger">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">Description</label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            placeholder="Brief description (optional)"
            maxLength={500}
          />
          {descriptionError && <p className="mt-1 text-sm text-danger">{descriptionError}</p>}
        </div>

        {/* Due date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Due date <span className="text-xs text-content-muted">(optional)</span>
          </label>
          <DatePicker
            value={dueDate ?? undefined}
            onChange={(date) => setDueDate(date)}
            placeholder="Select due date (optional)"
            minDate={new Date()}
          />
        </div>

        {/* Recurrence */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Recurrence <span className="text-xs text-content-muted">(requires due date)</span>
          </label>
          <div className="flex gap-2">
            {(["DAILY", "WEEKLY", "MONTHLY"] as const).map((r) => (
              <button
                key={r}
                type="button"
                disabled={!dueDate}
                onClick={() => setRecurrence(recurrence === r ? null : r)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                  recurrence === r
                    ? "bg-accent/10 border-accent text-accent"
                    : "border-border-strong text-content-muted hover:border-accent hover:text-content"
                }`}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-white shadow-soft transition-all duration-200 hover:bg-accent-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} /> Add Goal
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddGoalModal;

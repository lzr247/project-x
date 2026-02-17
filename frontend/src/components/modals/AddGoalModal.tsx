import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createGoal } from "../../api/projects.api";
import type { CreateGoalRequest } from "../../types";
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

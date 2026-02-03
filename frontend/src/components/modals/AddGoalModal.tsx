import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createGoal } from "../../api/projects.api";
import type { CreateGoalRequest } from "../../types";
import Modal from "./Modal";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectColor: string;
}

const AddGoalModal = ({ isOpen, onClose, projectId, projectColor }: AddGoalModalProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalRequest>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateGoalRequest) => createGoal(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Goal added successfully!");
      reset();
      onClose();
    },
    onError: () => {
      toast.error("Failed to add goal");
    },
  });

  const onSubmit = (data: CreateGoalRequest) => {
    mutation.mutate(data);
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
              maxLength: { value: 200, message: "Maximum 200 characters" },
            })}
            type="text"
            placeholder="Enter goal title"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {errors.title && <p className="mt-1 text-sm text-danger">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">Description</label>
          <textarea
            {...register("description", {
              maxLength: { value: 500, message: "Maximum 500 characters" },
            })}
            rows={3}
            placeholder="Brief description (optional)"
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {errors.description && <p className="mt-1 text-sm text-danger">{errors.description.message}</p>}
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

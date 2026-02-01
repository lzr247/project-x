import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { createProject } from "../../api/projects.api";
import type { CreateProjectRequest } from "../../types";
import { ColorPicker } from "../ColorPicker";
import Modal from "./Modal";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateProjectRequest>({
    defaultValues: {
      title: "",
      description: "",
      color: "#6636F1",
    },
  });

  const selectedColor = useWatch({ control, name: "color" });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
      reset();
      onClose();
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });

  const onSubmit = (data: CreateProjectRequest) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New project"
      size="md"
      colorBar={selectedColor}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Project name <span className="text-xs text-danger">*</span>
          </label>
          <input
            {...register("title", {
              required: "Name is required",
              minLength: { value: 1, message: "Name is required" },
              maxLength: { value: 100, message: "Maximum 100 characters" },
            })}
            type="text"
            placeholder="Enter project name"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-danger">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Description
          </label>
          <textarea
            {...register("description", {
              maxLength: { value: 500, message: "Maximum 500 characters" },
            })}
            rows={3}
            placeholder="Brief project description (optional)"
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-danger">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Color picker */}
        <div>
          <label className="mb-3 block text-sm font-medium text-content">
            Project Color
          </label>
          <ColorPicker
            value={selectedColor || "#6366F1"}
            onChange={(color) => setValue("color", color)}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-white shadow-soft transition-all duration-200 hover:bg-accent-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />{" "}
              Creating...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} /> Create project
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;

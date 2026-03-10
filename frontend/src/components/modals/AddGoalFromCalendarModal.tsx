import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createGoal, getProjects } from "../../api/projects.api";
import { RECURRENCE_OPTIONS } from "../../consts";
import type { CreateGoalRequest, Recurrence } from "../../types";
import CustomDropdown from "../common/CustomDropdown";
import DatePicker from "../common/DatePicker";
import Modal from "./Modal";

interface AddGoalFromCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate: string;
}

const AddGoalFromCalendarModal = ({ isOpen, onClose, defaultDate }: AddGoalFromCalendarModalProps) => {
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>(defaultDate);
  const [recurrence, setRecurrence] = useState<Recurrence | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalRequest>({ defaultValues: { title: "" } });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects({ limit: 100, status: "ACTIVE" }),
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateGoalRequest) => createGoal(selectedProjectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", selectedProjectId] });
      toast.success("Goal added successfully!");
      reset();
      setSelectedProjectId(null);
      setDueDate(defaultDate);
      setRecurrence(null);
      onClose();
    },
    onError: () => {
      toast.error("Failed to add goal.");
    },
  });

  const onSubmit = (data: CreateGoalRequest) => {
    mutation.mutate({
      ...data,
      dueDate,
      recurrence: recurrence ?? undefined,
    });
  };

  const projects = projectsData?.data ?? [];
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectOptions = projects.map((p) => ({ label: p.title, value: p.id, color: p.color }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add goal" size="md" colorBar={selectedProject?.color}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Select project */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Project <span className="text-xs text-danger">*</span>
          </label>
          <CustomDropdown
            options={projectOptions}
            value={selectedProjectId ?? ""}
            onChange={setSelectedProjectId}
            placeholder="Select project..."
            fullWidth
          />
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Goal title <span className="text-xs text-danger">*</span>
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 30, message: "Maximum 30 characters" },
            })}
            type="text"
            placeholder="Enter goal title"
            className="focus:ring-accent/20 w-full rounded-xl border border-border-strong bg-surface-card px-4 py-3 text-content outline-none transition-all focus:border-accent focus:ring-2"
          />
          {errors.title && <p className="mt-1 text-sm text-danger">{errors.title.message}</p>}
        </div>

        {/* Due date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">Due date</label>
          <DatePicker
            value={dueDate}
            onChange={(date) => setDueDate(date ?? defaultDate)}
            placeholder="Select due date"
            minDate={new Date()}
          />
        </div>

        {/* Recurrence */}
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Recurrence <span className="text-xs text-content-muted">(requires due date)</span>
          </label>
          <div className="flex gap-2">
            {RECURRENCE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                disabled={!dueDate}
                onClick={() => setRecurrence(recurrence === r ? null : r)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                  recurrence === r
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border-strong text-content-muted hover:border-accent hover:text-content"
                }`}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending || !selectedProjectId}
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

export default AddGoalFromCalendarModal;

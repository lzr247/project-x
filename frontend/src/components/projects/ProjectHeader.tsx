import {
  faArchive,
  faBullseye,
  faCalendarAlt,
  faCheck,
  faEllipsisV,
  faPause,
  faPlay,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import type { ProjectStatus, ProjectWithGoals } from "../../types";

interface ProjectHeaderProps {
  project: ProjectWithGoals;
  totalGoals: number;
  onUpdateStatus: (status: ProjectStatus) => void;
  onArchive: () => void;
  onDeleteProject: () => void;
  onUpdateDescription: (description: string) => void;
}

const ProjectHeader = ({
  project,
  totalGoals,
  onUpdateStatus,
  onArchive,
  onDeleteProject,
  onUpdateDescription,
}: ProjectHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
      descriptionRef.current.selectionStart = descriptionRef.current.value.length;
    }
  }, [isEditingDescription]);

  const handleStartEditDescription = () => {
    setDescriptionDraft(project.description || "");
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    const trimmed = descriptionDraft.trim();
    if (trimmed !== (project.description || "")) {
      onUpdateDescription(trimmed);
    }
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setIsEditingDescription(false);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${project.color}15` }}
          >
            <FontAwesomeIcon icon={faBullseye} className="text-xl" style={{ color: project.color }} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl font-bold text-content sm:text-2xl">{project.title}</h1>
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
                <span className="inline-flex items-center rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-medium text-content-muted">
                  Archived
                </span>
              )}
            </div>
            {isEditingDescription ? (
              <div className="mt-1">
                <textarea
                  ref={descriptionRef}
                  value={descriptionDraft}
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveDescription();
                    }
                    if (e.key === "Escape") handleCancelDescription();
                  }}
                  onBlur={handleSaveDescription}
                  rows={2}
                  placeholder="Add a description..."
                  className="focus:ring-accent/20 w-full resize-none rounded-lg border border-border-strong bg-surface-card px-3 py-2 text-sm text-content outline-none transition-all focus:border-accent focus:ring-2"
                  maxLength={500}
                />
              </div>
            ) : (
              <button onClick={handleStartEditDescription} className="mt-1 cursor-pointer text-left">
                {project.description ? (
                  <p className="text-content-secondary transition-colors hover:text-content">{project.description}</p>
                ) : (
                  <p className="text-sm italic text-content-muted transition-colors hover:text-content-secondary">
                    Add a description...
                  </p>
                )}
              </button>
            )}
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
        <div className="flex flex-wrap items-center gap-2">
          {project.status !== "COMPLETED" && (
            <button
              onClick={() => onUpdateStatus("COMPLETED")}
              className="border-success/20 bg-success/5 hover:bg-success/10 cursor-pointer rounded-xl border px-2.5 py-2 text-sm font-medium text-success transition-all sm:px-4"
            >
              <FontAwesomeIcon icon={faCheck} className="sm:mr-2" />
              <span className="hidden sm:inline">Complete</span>
            </button>
          )}
          {project.status !== "ON_HOLD" && (
            <button
              onClick={() => onUpdateStatus("ON_HOLD")}
              className="cursor-pointer rounded-xl border border-yellow-300/50 bg-yellow-50 px-2.5 py-2 text-sm font-medium text-yellow-700 transition-all hover:bg-yellow-100 sm:px-4"
            >
              <FontAwesomeIcon icon={faPause} className="sm:mr-2" />
              <span className="hidden sm:inline">On Hold</span>
            </button>
          )}
          {(project.status === "COMPLETED" || project.status === "ON_HOLD") && (
            <button
              onClick={() => onUpdateStatus("ACTIVE")}
              className="border-accent/20 bg-accent/5 hover:bg-accent/10 cursor-pointer rounded-xl border px-2.5 py-2 text-sm font-medium text-accent transition-all sm:px-4"
            >
              <FontAwesomeIcon icon={faPlay} className="sm:mr-2" />
              <span className="hidden sm:inline">Reactivate</span>
            </button>
          )}

          {/* Dropdown menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer rounded-xl border border-border-strong bg-surface-card p-2.5 text-content-secondary transition-all hover:bg-surface-hover"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-surface-card py-1 shadow-card-hover sm:left-auto sm:right-0">
                  <button
                    onClick={() => {
                      onArchive();
                      setIsDropdownOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-content-secondary transition-colors hover:bg-surface"
                  >
                    <FontAwesomeIcon icon={faArchive} className="w-4" />
                    {project.isArchived ? "Unarchive" : "Archive"}
                  </button>
                  <div className="mx-3 my-1 border-t border-border" />
                  <button
                    onClick={() => {
                      onDeleteProject();
                      setIsDropdownOpen(false);
                    }}
                    className="hover:bg-danger/5 flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-danger transition-colors"
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
  );
};

export default ProjectHeader;

import {
  faArchive,
  faChevronLeft,
  faChevronRight,
  faExclamationTriangle,
  faFolderOpen,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProjects } from "../api/projects.api";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import ProjectCard from "../components/projects/ProjectCard";
import { ProjectCardSkeleton } from "../components/skeletons/ProjectCardSkeleton";
import type { ProjectStatus } from "../types";

const STATUS_FILTERS: { label: string; value: ProjectStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Cancelled", value: "CANCELLED" },
];

const Projects = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state from URL — defaults are clean (not in URL)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const statusFilter = (searchParams.get("status") ?? "ALL") as ProjectStatus | "ALL";
  const searchInUrl = searchParams.get("search") ?? "";
  const showArchived = searchParams.get("archived") === "true";

  // Local input state for debouncing — initialised from URL
  const [inputValue, setInputValue] = useState(searchInUrl);

  // Sync input if URL changes externally (browser back/forward)
  useEffect(() => {
    setInputValue(searchInUrl);
  }, [searchInUrl]);

  // Write URL params helper — removes params that are at their default value to keep URL clean
  const setParams = (updates: Record<string, string | null>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === "" || value === "ALL" || value === "false" || value === "1") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      },
      { replace: true }
    );
  };

  // Debounce search — only write to URL when input actually differs from URL (prevents firing on mount)
  useEffect(() => {
    if (inputValue === searchInUrl) return;
    const timer = setTimeout(() => {
      setParams({ search: inputValue, page: null });
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleStatusChange = (value: ProjectStatus | "ALL") => {
    setParams({ status: value, page: null });
  };

  const handleArchivedChange = (archived: boolean) => {
    setParams({ archived: String(archived), status: null, search: null, page: null });
    setInputValue("");
  };

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["projects", { archived: showArchived, page, status: statusFilter, search: searchInUrl }],
    queryFn: () =>
      getProjects({
        archived: showArchived,
        page,
        limit: 20,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: searchInUrl || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const projects = response?.data;
  const pagination = response?.pagination;

  // Redirect to page 1 if requested page is out of range — only when response is for current page
  useEffect(() => {
    if (!isFetching && pagination && pagination.page === page && pagination.totalPages > 0 && page > pagination.totalPages) {
      setParams({ page: null });
    }
  }, [isFetching, pagination, page]);

  return (
    <div className="min-h-full">
      {/* Header - Row 1: Title + Button */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-content">Projects</h1>
            <p className="mt-1 text-sm text-content-muted">
              {pagination ? `${pagination.total} project${pagination.total !== 1 ? "s" : ""}` : "Loading..."}
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-medium text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Project
          </button>
        </div>

        {/* Row 2: Search + Tabs */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="focus:ring-accent/20 w-full rounded-xl border border-border-strong bg-surface-card py-2.5 pl-11 pr-4 text-sm text-content outline-none transition-all focus:border-accent focus:ring-2"
            />
          </div>

          <div className="flex rounded-xl bg-surface p-1">
            <button
              onClick={() => handleArchivedChange(false)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                !showArchived ? "bg-surface-card text-content shadow-sm" : "text-content-muted hover:text-content"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleArchivedChange(true)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                showArchived ? "bg-surface-card text-content shadow-sm" : "text-content-muted hover:text-content"
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Row 3: Status filters */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleStatusChange(filter.value)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === filter.value
                  ? "bg-accent text-white"
                  : "bg-surface-card text-content-secondary hover:bg-surface-hover hover:text-content"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-danger/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-danger" />
          </div>
          <p className="text-content-secondary">Failed to load projects</p>
        </div>
      ) : projects && projects.length > 0 ? (
        <>
          <div
            className={`grid grid-cols-1 gap-5 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setParams({ page: String(page - 1) })}
                disabled={page === 1}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-content-secondary transition-all hover:bg-surface-card hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                Previous
              </button>
              <span className="text-sm text-content-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setParams({ page: String(page + 1) })}
                disabled={page === pagination.totalPages}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-content-secondary transition-all hover:bg-surface-card hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>
            </div>
          )}
        </>
      ) : searchInUrl || statusFilter !== "ALL" ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <FontAwesomeIcon icon={faSearch} className="text-2xl text-content-muted" />
          </div>
          <p className="text-content-secondary">No projects found{searchInUrl ? ` for "${searchInUrl}"` : ""}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-accent/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={showArchived ? faArchive : faFolderOpen} className="text-3xl text-accent" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-content">
            {showArchived ? "No archived projects" : "No projects yet"}
          </h3>
          <p className="mb-6 max-w-sm text-center text-content-secondary">
            {showArchived
              ? "Projects you archive will appear here"
              : "Create your first project and start organizing your goals"}
          </p>
          {!showArchived && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-medium text-white transition-all duration-200 hover:bg-accent-hover"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create First Project
            </button>
          )}
        </div>
      )}

      {/* Create modal */}
      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default Projects;

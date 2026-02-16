import { faArchive, faExclamationTriangle, faFolderOpen, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProjects } from "../api/projects.api";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import ProjectCard from "../components/projects/ProjectCard";
import { ProjectCardSkeleton } from "../components/skeletons/ProjectCardSkeleton";

const Projects = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects", showArchived],
    queryFn: () => getProjects(showArchived),
  });

  const filteredProjects =
    searchQuery !== ""
      ? projects?.filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : projects;

  return (
    <div className="min-h-full">
      {/* Header - Row 1: Title + Button */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-content">Projects</h1>
            <p className="mt-1 text-sm text-content-muted">
              {projects ? `${projects.length} project${projects.length !== 1 ? "s" : ""}` : "Loading..."}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="flex rounded-xl bg-surface p-1">
            <button
              onClick={() => setShowArchived(false)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                !showArchived ? "bg-white text-content shadow-sm" : "text-content-muted hover:text-content"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                showArchived ? "bg-white text-content shadow-sm" : "text-content-muted hover:text-content"
              }`}
            >
              Archived
            </button>
          </div>
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
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-danger" />
          </div>
          <p className="text-content-secondary">Failed to load projects</p>
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <FontAwesomeIcon icon={faSearch} className="text-2xl text-content-muted" />
          </div>
          <p className="text-content-secondary">No results for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
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

import {
  faExclamationTriangle,
  faFolderOpen,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
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

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const filteredProjects =
    searchQuery !== ""
      ? projects?.filter((project) => {
          project.title.toLowerCase().includes(searchQuery.toLowerCase());
        })
      : projects;

  console.log(projects);

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-content">Projects</h1>
            <p className="text-content-secondary mt-1">
              Manage your projects and goals
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 py-2.5 px-5 bg-accent hover:bg-accent-hover text-white font-medium rounded-xl transition-all duration-200 shadow-soft hover:shadow-md hover:-translate-y-0.5"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Project
          </button>

          {/* Search bar */}
          <div className="relative max-w-md">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
            />
            <input
              type="text"
              placeholder="Search projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border-gray-200 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-2xl text-danger"
            />
          </div>
          <p className="text-content-secondary">Failed to load projects</p>
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-2xl text-content-muted"
            />
          </div>
          <p className="text-content-secondary">
            No results for "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="text-3xl text-accent"
            />
          </div>
          <h3 className="text-lg font-semibold text-content mb-2">
            No projects yet
          </h3>
          <p className="text-content-secondary mb-6 text-center max-w-sm">
            Create your first project and start organizing your goals
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium rounded-xl transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create First Project
          </button>
        </div>
      )}

      {/* Create modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Projects;

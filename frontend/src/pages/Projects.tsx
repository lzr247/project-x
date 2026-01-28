import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projects.api";

const Projects = () => {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  console.log(projects);

  if (isLoading) <div>Loading...</div>;

  if (error) <div>Error loading projects</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-900">Projects</h1>
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-primary-100 overflow-hidden"
            >
              {/* Color bar */}
              <div className="h-2" style={{ backgroundColor: project.color }} />

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-primary-900">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-primary-400 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-primary-400">
          No projects yet. Create your first project!
        </div>
      )}
    </div>
  );
};

export default Projects;

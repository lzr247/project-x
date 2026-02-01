export const ProjectCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
      {/* Color Bar Skeleton */}
      <div className="h-1.5 bg-gray-200 animate-pulse" />

      <div className="p-5">
        {/* Header Skeleton */}
        <div className="flex items-start gap-3 mb-3">
          {/* Icon Skeleton */}
          <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />

          <div className="flex-1">
            {/* Title Skeleton */}
            <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
        </div>

        {/* Goals Section Skeleton */}
        <div className="mt-4 py-2 px-3 bg-surface rounded-lg">
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
};

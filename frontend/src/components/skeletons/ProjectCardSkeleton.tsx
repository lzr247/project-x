export const ProjectCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
      {/* Color Bar Skeleton */}
      <div className="h-1.5 animate-pulse bg-gray-200" />

      <div className="p-5">
        {/* Title Skeleton */}
        <div className="mb-1">
          <div className="h-5 w-3/5 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Description Skeleton */}
        <div className="mb-3 space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
        </div>

        {/* Date Skeleton */}
        <div className="mt-auto">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
        </div>

        {/* Goals Progress Skeleton */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-1.5 flex-1 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
};

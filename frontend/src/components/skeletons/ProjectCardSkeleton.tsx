export const ProjectCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
      {/* Color Bar Skeleton */}
      <div className="h-1.5 animate-pulse bg-gray-200" />

      <div className="p-5">
        {/* Header Skeleton */}
        <div className="mb-3 flex items-start gap-3">
          {/* Icon Skeleton */}
          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

          <div className="flex-1">
            {/* Title Skeleton */}
            <div className="h-5 w-3/4 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
        </div>

        {/* Goals Section Skeleton */}
        <div className="mt-4 rounded-lg bg-surface px-3 py-2">
          <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

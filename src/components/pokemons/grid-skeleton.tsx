export const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 animate-pulse"
      >
        <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
      </div>
    ))}
  </div>
);

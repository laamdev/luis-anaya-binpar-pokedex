import { SearchX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="w-16 h-16 text-neutral-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Pokémon found</h2>
      <p className="text-neutral-500 max-w-md">
        {message ||
          "Sorry, there's no results matching your search and filter criteria."}
      </p>
    </div>
  );
}

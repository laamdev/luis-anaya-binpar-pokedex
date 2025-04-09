import { SearchX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Pokémon found</h2>
      <p className="text-gray-500 max-w-md">
        {message ||
          "We couldn't find any Pokémon matching your search criteria. Try adjusting your filters or search terms."}
      </p>
    </div>
  );
}

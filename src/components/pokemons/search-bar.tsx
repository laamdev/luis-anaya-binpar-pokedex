"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useDebounce } from "@/hooks/use-debounce";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch && debouncedSearch.length >= 3) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);

    // Invalidate the pokemons query to trigger a refetch with the new search term
    if (debouncedSearch && debouncedSearch.length >= 3) {
      queryClient.invalidateQueries({ queryKey: ["pokemons"] });
    }
  }, [debouncedSearch, router, searchParams, queryClient]);

  return (
    <div className="relative w-full sm:w-96">
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Type at least 3 characters to search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pr-9"
      />
    </div>
  );
};

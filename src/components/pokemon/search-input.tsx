"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search Pokémon by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

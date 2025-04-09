"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { generations } from "@/lib/data/generations";

export const GenerationFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const currentFilter = searchParams.get("generation") || "all";

  const handleFilter = (generation: string) => {
    const params = new URLSearchParams(searchParams);
    if (generation === "all") {
      params.delete("generation");
    } else {
      params.set("generation", generation);
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);

    // Invalidate the pokemons query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ["pokemons"] });
  };

  return (
    <Select value={currentFilter} onValueChange={handleFilter}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Generation" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <span className="uppercase">All Generations</span>
        </SelectItem>
        {generations.map((generation) => (
          <SelectItem key={generation.value} value={generation.value}>
            <span className="uppercase">
              {generation.name.replace("Generation ", "")}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

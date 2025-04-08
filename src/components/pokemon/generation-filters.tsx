"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Generation } from "@/api/queries";

export const GenerationFilters = ({
  generations,
}: {
  generations: Generation[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
  };

  return (
    <Select value={currentFilter} onValueChange={handleFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Generation" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <span className="uppercase">All Generations</span>
        </SelectItem>
        {generations.map((generation) => {
          const generationNumber = generation.name.replace("generation-", "");
          return (
            <SelectItem key={generation.name} value={generation.name}>
              <span className="uppercase">{generationNumber}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

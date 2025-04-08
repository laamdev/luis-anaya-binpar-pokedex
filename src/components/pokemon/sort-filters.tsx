"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { sorts } from "@/lib/data/sorts";

export const SortFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentFilter = searchParams.get("sort") || "id";

  const handleFilter = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort === "id") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentFilter} onValueChange={handleFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        {sorts.map((sort) => {
          return (
            <SelectItem key={sort.value} value={sort.value}>
              <span className="uppercase">{sort.name}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

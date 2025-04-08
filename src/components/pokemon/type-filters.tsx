"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { types } from "@/lib/data/types";

export const TypeFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentFilter = searchParams.get("type") || "all";

  const handleFilter = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentFilter} onValueChange={handleFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <span className="uppercase">All Types</span>
        </SelectItem>
        {types.map((type) => (
          <SelectItem key={type.name} value={type.name}>
            <span className="uppercase">{type.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

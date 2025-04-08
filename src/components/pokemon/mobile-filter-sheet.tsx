"use client";

import { TypeFilters } from "@/components/pokemon/type-filters";
import { GenerationFilters } from "@/components/pokemon/generation-filters";
import { SortFilters } from "@/components/pokemon/sort-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";
import { Generation } from "@/api/queries";

interface MobileFilterSheetProps {
  generations: Generation[];
}

export const MobileFilterSheet = ({ generations }: MobileFilterSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <FilterIcon className="size-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Sort & Filter</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6 p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Filter by Type</h3>
            <TypeFilters />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Filter by Generation</h3>
            <GenerationFilters generations={generations} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sort by</h3>
            <SortFilters />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PokemonLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <div className="relative aspect-square rounded-xl bg-gradient-to-b from-background to-transparent">
          <Skeleton className="absolute inset-0 m-8 rounded-full" />
        </div>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolution Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="size-24 rounded-xl" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

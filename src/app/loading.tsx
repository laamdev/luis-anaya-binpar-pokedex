import { Skeleton } from "@/components/ui/skeleton";

export default function Loader() {
  return (
    <section>
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-64" />
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>

      <div className="hidden md:flex mt-12 justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex gap-4 sm:flex-row flex-col mt-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex gap-4 mt-2">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      <ul className="grid mt-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-fr">
        {Array.from({ length: 20 }).map((_, index) => (
          <li key={index} className="h-full">
            <div className="flex p-4 relative flex-col border rounded-xl h-full">
              <Skeleton className="absolute top-2 right-2 h-6 w-12" />
              <div className="flex-1 flex flex-col items-center">
                <div className="h-[180px] w-full flex items-center justify-center">
                  <Skeleton className="h-32 w-32 rounded-full" />
                </div>
                <div className="flex flex-col gap-2 items-center text-center w-full mt-auto">
                  <div className="flex flex-col gap-1 items-center text-center">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex justify-center">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </section>
  );
}

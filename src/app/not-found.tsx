import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function Error() {
  return (
    <div className="flex h-[calc(100vh-4rem-3rem)] flex-col items-center justify-center gap-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Oops! Page not found
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          We apologize for the inconvenience.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
          Go back to home
        </Link>
      </div>
    </div>
  );
}

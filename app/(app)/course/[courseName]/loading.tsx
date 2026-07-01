/** biome-ignore-all lint/suspicious/noArrayIndexKey: safe here */

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8"
      aria-hidden
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-5 rounded-[2rem] border border-oe-border bg-oe-surface p-8">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-9 w-3/4 rounded-lg" />
          <Skeleton className="mx-auto mt-4 size-32 rounded-full" />
          <Skeleton className="mt-4 h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>

        <div className="rounded-[2rem] border border-oe-border bg-oe-surface p-8">
          <div className="flex flex-col gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-1/2 rounded" />
                <div className="space-y-3 pt-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-5 w-2/3 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

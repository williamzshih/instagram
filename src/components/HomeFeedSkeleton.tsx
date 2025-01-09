import { Skeleton } from "@/components/ui/skeleton";

export default function HomeFeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 overflow-x-auto">
        <Skeleton className="w-20 h-20 rounded-full shrink-0" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1 shrink-0"
          >
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-16 h-3" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="aspect-video w-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-6 w-6" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-[200px] mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

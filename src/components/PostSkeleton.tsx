import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-1">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-[200px] mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-[150px] mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="flex-1 h-20" />
        </div>
      </div>
    </div>
  );
}

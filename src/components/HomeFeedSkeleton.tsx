import { Skeleton } from "@/components/ui/skeleton";

export default function HomeFeedSkeleton() {
  return (
    <div>
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-full border-2">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1"
          >
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="w-16 h-3" />
          </div>
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mt-4">
          <Skeleton className="w-full h-[400px] rounded-md" />
        </div>
      ))}
    </div>
  );
}

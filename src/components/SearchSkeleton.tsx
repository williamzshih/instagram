import { Skeleton } from "@/components/ui/skeleton";

export default function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-10 w-full" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-48 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

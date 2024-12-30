import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-40" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full" />
        ))}
      </div>
    </div>
  );
}

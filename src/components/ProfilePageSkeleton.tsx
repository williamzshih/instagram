import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="p-1 rounded-full bg-linear-to-tr from-ig-orange to-ig-red">
          <div className="p-1 rounded-full bg-background">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-60" />
        <div className="flex gap-4">
          <Skeleton className="h-16 w-24" />
          <Skeleton className="h-16 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-3 gap-4 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}

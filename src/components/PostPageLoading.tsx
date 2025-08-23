import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PostPageLoading({ home }: { home?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-square w-full" />
        <div className="flex justify-between">
          <div className={cn("flex items-center gap-2", home && "lg:ml-4")}>
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-6 w-8" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="text-right">
            <Skeleton className="ml-auto h-3 w-16" />
          </div>
        </div>
        <Separator />
        {!home &&
          Array.from({ length: 2 }).map((_, i) => (
            <div className="flex flex-col gap-4" key={i}>
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="text-right">
                <Skeleton className="ml-auto h-3 w-12" />
              </div>
            </div>
          ))}
        <div className="flex justify-center">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

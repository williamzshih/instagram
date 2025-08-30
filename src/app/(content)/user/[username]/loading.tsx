import PostGridLoading from "@/components/PostGridLoading";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserLoading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="rounded-full bg-gray-200 p-1">
        <div className="bg-background rounded-full p-1">
          <Skeleton className="size-40 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-12 w-16 rounded-md" />
        <Skeleton className="h-12 w-16 rounded-md" />
      </div>
      <Skeleton className="h-9 w-20 rounded-md" />
      <PostGridLoading />
    </div>
  );
}

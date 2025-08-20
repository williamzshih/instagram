import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProfilePageSkeleton({
  isCurrentUser,
}: {
  isCurrentUser?: boolean;
}) {
  return (
    <div className="flex-1 p-4 mb-16 lg:mb-0">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-10 w-10 rounded-md invisible" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton
              className={cn(
                "h-10 w-10 rounded-md",
                !isCurrentUser && "invisible"
              )}
            />
          </div>
          <div className="p-1 rounded-full bg-linear-to-tr from-ig-orange to-ig-red">
            <div className="p-1 rounded-full bg-background">
              <Skeleton className="w-40 h-40 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-7 w-32 rounded-md" />
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center justify-center gap-0">
              <Skeleton className="h-6 w-10 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md mt-1" />
            </div>
            <div className="flex flex-col items-center justify-center gap-0">
              <Skeleton className="h-6 w-10 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md mt-1" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          {isCurrentUser && (
            <>
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </>
          )}
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <div className="flex -ml-4 w-full">
          {[...Array(4)].map((_, colIndex) => (
            <div className="pl-4 w-1/4" key={colIndex}>
              {[...Array(2)].map((_, rowIndex) => (
                <div className="mb-4" key={`${colIndex}-${rowIndex}`}>
                  <Skeleton className="w-full h-40 aspect-square rounded-md" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

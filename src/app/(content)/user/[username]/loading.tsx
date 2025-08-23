import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserLoading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="flex gap-4">
          <User className="size-8" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="from-ig-orange to-ig-red rounded-full bg-linear-to-tr p-1">
        <div className="bg-background rounded-full p-1">
          <Skeleton className="size-40 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-16 w-20 rounded-md" />
        <Skeleton className="h-16 w-20 rounded-md" />
      </div>
      <Skeleton className="h-9 w-20 rounded-md" />
      <div className="size-full text-center">
        <div className="-ml-4 flex w-full">
          <div className="flex-1 pl-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div className="mb-4" key={`col1-${i}`}>
                <Skeleton
                  className="w-full rounded-lg"
                  style={{
                    height: `${Math.floor(Math.random() * 150) + 250}px`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="hidden flex-1 pl-4 sm:block">
            {Array.from({ length: 3 }, (_, i) => (
              <div className="mb-4" key={`col2-${i}`}>
                <Skeleton
                  className="w-full rounded-lg"
                  style={{
                    height: `${Math.floor(Math.random() * 150) + 250}px`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="hidden flex-1 pl-4 lg:block">
            {Array.from({ length: 3 }, (_, i) => (
              <div className="mb-4" key={`col3-${i}`}>
                <Skeleton
                  className="w-full rounded-lg"
                  style={{
                    height: `${Math.floor(Math.random() * 150) + 250}px`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

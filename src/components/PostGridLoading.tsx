import { Skeleton } from "@/components/ui/skeleton";

export default function PostGridLoading() {
  return (
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
  );
}

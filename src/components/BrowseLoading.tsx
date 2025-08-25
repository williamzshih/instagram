import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  const skeletonItems = Array.from({ length: 12 }, (_, i) => ({
    height: Math.floor(Math.random() * 200) + 300,
    id: i,
  }));

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {skeletonItems.map((item) => (
        <div className="mb-4 break-inside-avoid" key={item.id}>
          <Skeleton
            className="w-full rounded-lg"
            style={{ height: `${item.height}px` }}
          />
        </div>
      ))}
    </div>
  );
}

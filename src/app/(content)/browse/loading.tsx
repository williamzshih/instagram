import { LayoutGrid } from "lucide-react";
import localFont from "next/font/local";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const googleSans = localFont({
  src: "../../fonts/GoogleSansCodeVF.ttf",
});

export default function BrowseLoading() {
  const skeletonItems = Array.from({ length: 12 }, (_, i) => ({
    height: Math.floor(Math.random() * 200) + 300,
    id: i,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 lg:ml-6">
        <LayoutGrid className="size-8" />
        <p className={`text-2xl font-semibold ${googleSans.className}`}>
          Browse
        </p>
      </div>
      <div className="flex items-center gap-4 lg:ml-6">
        Sort by:
        <Button className="cursor-pointer" variant="outline">
          Newest
        </Button>
      </div>
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
    </div>
  );
}

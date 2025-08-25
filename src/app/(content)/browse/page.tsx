"use client";

import { useQuery } from "@tanstack/react-query";
import { LayoutGrid } from "lucide-react";
import localFont from "next/font/local";
import { redirect, useSearchParams } from "next/navigation";
import { getSortedPosts } from "@/actions/post";
import BrowseLoading from "@/components/BrowseLoading";
import PostGrid from "@/components/PostGrid";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const googleSans = localFont({
  src: "../../fonts/GoogleSansCodeVF.ttf",
});

const sortOptions = [
  "Newest",
  "Oldest",
  "Most likes",
  "Least likes",
  "Most comments",
  "Least comments",
];

export default function Browse() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "Newest";

  const { data, error, isPending } = useQuery({
    queryFn: () => getSortedPosts(sort),
    queryKey: ["browse", sort],
  });

  if (error) {
    console.error("Error getting sorted posts:", error);
    throw new Error("Error getting sorted posts:", { cause: error });
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="cursor-pointer" variant="outline">
              {sort}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              onValueChange={(value) => redirect(`?sort=${value}`)}
              value={sort}
            >
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option} value={option}>
                  {option}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isPending ? (
        <BrowseLoading />
      ) : data.length > 0 ? (
        <PostGrid posts={data} />
      ) : (
        <p className="text-muted-foreground flex justify-center">
          No posts yet. Be the first to create a post!
        </p>
      )}
    </div>
  );
}

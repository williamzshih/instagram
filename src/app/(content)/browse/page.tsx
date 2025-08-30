"use client";

import {
  DefaultError,
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { LayoutGrid, LoaderCircle } from "lucide-react";
import localFont from "next/font/local";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
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

type Posts = Awaited<ReturnType<typeof getSortedPosts>>;

export default function Browse() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "Newest";
  const ref = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery<
    Posts,
    DefaultError,
    InfiniteData<Posts>,
    QueryKey,
    string | undefined
  >({
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.id,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getSortedPosts({ id: pageParam, sort }),
    queryKey: ["browse", sort],
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) fetchNextPage();
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

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
      ) : data.pages.flat().length > 0 ? (
        <>
          <PostGrid posts={data.pages.flat()} />
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <LoaderCircle className="animate-spin" size={48} />
            </div>
          )}
          {hasNextPage && <div ref={ref} />}
        </>
      ) : (
        <p className="text-muted-foreground flex justify-center">
          No posts yet. Be the first to create a post!
        </p>
      )}
    </div>
  );
}

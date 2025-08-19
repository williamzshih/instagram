"use client";

import { useQuery } from "@tanstack/react-query";
import { redirect, useSearchParams } from "next/navigation";
import { getPosts } from "@/actions/post";
import Loading from "@/components/Loading";
import PostGrid from "@/components/PostGrid";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Browse() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "newest";

  const {
    data: posts,
    error,
    isPending,
  } = useQuery({
    queryFn: () => getPosts(sort),
    queryKey: ["posts", sort],
  });

  if (error) {
    console.error("Error getting posts:", error);
    throw new Error("Error getting posts:", { cause: error });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-bold">Browse</p>
      <div className="flex items-center gap-2">
        <p>Sort by:</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              onValueChange={(value) => redirect(`?sort=${value}`)}
              value={sort}
            >
              <DropdownMenuRadioItem value="newest">
                Newest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">
                Oldest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="trending">
                Trending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isPending ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <PostGrid posts={posts} type="posts" />
      )}
    </div>
  );
}

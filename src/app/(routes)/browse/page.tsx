"use client";

import { getPosts } from "@/actions/post";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostsGrid from "@/components/PostsGrid";
import BrowseSkeleton from "@/components/BrowseSkeleton";

export default function Browse() {
  const [sortBy, setSortBy] = useState("Newest");

  const {
    data: posts,
    isPending,
    error,
  } = useQuery({
    queryKey: ["posts", sortBy],
    queryFn: () => getPosts(sortBy),
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return <BrowseSkeleton />;
  }

  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-bold">Browse</p>
      <div className="flex items-center gap-2">
        <p>Sort by:</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{sortBy}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="Newest">
                Newest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Oldest">
                Oldest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Most popular">
                Most popular
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <PostsGrid posts={posts} />
    </div>
  );
}

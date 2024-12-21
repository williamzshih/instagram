"use client";

import PostsGrid from "@/components/PostsGrid";
import { getPosts } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function BrowsePage() {
  const [sortBy, setSortBy] = useState("Newest");

  const {
    data: posts,
    isPending,
    error,
  } = useQuery({
    queryKey: ["posts", sortBy],
    queryFn: () => getPosts(sortBy),
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  if (error) {
    console.error("Error fetching posts:", error);
    toast.error("Error fetching posts");
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        Error fetching posts: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center justify-center gap-2">
        Sort by:
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{sortBy}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
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

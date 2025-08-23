"use client";

import { useQuery } from "@tanstack/react-query";
import { LayoutGrid } from "lucide-react";
import localFont from "next/font/local";
import { useState } from "react";
import { getSortedPosts } from "@/actions/post";
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
  src: "../app/fonts/GoogleSansCodeVF.ttf",
});

const sortOptions = [
  "Newest",
  "Oldest",
  "Most likes",
  "Least likes",
  "Most comments",
  "Least comments",
];

type Post = Awaited<ReturnType<typeof getSortedPosts>>[number];

export default function BrowsePage({ initialData }: { initialData: Post[] }) {
  const [sort, setSort] = useState("Newest");

  const { data } = useQuery({
    initialData,
    queryFn: () => getSortedPosts(sort),
    queryKey: ["posts", sort],
  });

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
              onValueChange={(value) => setSort(value)}
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
      <PostGrid posts={data} />
    </div>
  );
}

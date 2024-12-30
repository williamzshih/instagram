"use client";

import { getPosts } from "@/utils/actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import BrowsePage from "@/components/BrowsePage";

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
    if (posts) {
      return <BrowsePage posts={posts} sortBy={sortBy} setSortBy={setSortBy} />;
    }

    return <div>Loading...</div>;
  }

  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }

  return <BrowsePage posts={posts} sortBy={sortBy} setSortBy={setSortBy} />;
}

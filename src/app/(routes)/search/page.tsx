"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { searchPosts, searchUsers } from "@/utils/actions";
import { keepPreviousData } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import SearchResults from "@/components/SearchResults";
import { toast } from "sonner";

export default function Search() {
  const form = useForm();
  const search = form.watch("search");
  const [debouncedValue, setDebouncedValue] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(search), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const {
    data: users,
    isPending: isUsersPending,
    error: usersError,
  } = useQuery({
    queryKey: ["users", debouncedValue],
    queryFn: () => searchUsers(debouncedValue),
    placeholderData: keepPreviousData,
  });

  const {
    data: posts,
    isPending: isPostsPending,
    error: postsError,
  } = useQuery({
    queryKey: ["posts", debouncedValue],
    queryFn: () => searchPosts(debouncedValue),
    placeholderData: keepPreviousData,
  });

  if (isUsersPending || isPostsPending) {
    if (users && posts) {
      return (
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-bold">Search</p>
          <Input {...form.register("search")} placeholder="Search" />
          {debouncedValue && (
            <SearchResults users={users} posts={posts} q={debouncedValue} />
          )}
        </div>
      );
    }

    return <div>Loading...</div>;
  }

  if (usersError || postsError) {
    if (usersError) {
      toast.error(usersError.message);
    }
    if (postsError) {
      toast.error(postsError.message);
    }
    return (
      <div>
        <p>{usersError && usersError.message}</p>
        <p>{postsError && postsError.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-3xl font-bold">Search</p>
      <Input {...form.register("search")} placeholder="Search" />
      {debouncedValue && (
        <SearchResults users={users} posts={posts} q={debouncedValue} />
      )}
    </div>
  );
}

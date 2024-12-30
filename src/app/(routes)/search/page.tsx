"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { searchPosts } from "@/actions/post";
import { searchUsers } from "@/actions/user";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import UserHeader from "@/components/UserHeader";
import Link from "next/link";
import Masonry from "react-masonry-css";
import Image from "next/image";
import Comment from "@/components/Comment";
import SearchSkeleton from "@/components/SearchSkeleton";

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
    return <SearchSkeleton />;
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
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Search results for: {debouncedValue}
          </p>
          <Separator />
          <p className="text-2xl font-bold">Users</p>
          {users.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/user/${user.username}`}
                  className="bg-muted rounded-lg px-4 py-2"
                >
                  <UserHeader user={user} size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No users found</p>
          )}
          <Separator />
          <p className="text-2xl font-bold">Posts</p>
          {posts.length > 0 ? (
            <Masonry
              breakpointCols={{
                default: 4,
                1100: 3,
                700: 2,
                500: 1,
              }}
              className="flex -ml-4"
              columnClassName="pl-4"
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="bg-muted rounded-lg p-2 flex flex-col gap-2 mb-4"
                >
                  <Image
                    src={post.image}
                    alt="Post image"
                    width={1920}
                    height={1080}
                  />
                  <Separator />
                  <Comment
                    user={post.user}
                    comment={post.caption}
                    createdAt={post.createdAt}
                    size={12}
                  />
                </Link>
              ))}
            </Masonry>
          ) : (
            <p className="text-sm text-muted-foreground">No posts found</p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Masonry from "react-masonry-css";
import { getImageHeight, getImageWidth } from "@/actions/image";
import { searchPosts } from "@/actions/search";
import { searchUsers } from "@/actions/search";
import Comment from "@/components/Comment";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import UserBlock from "@/components/UserBlock";

export default function Search() {
  const form = useForm();
  const search: string = form.watch("search");
  const [debouncedValue, setDebouncedValue] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: users,
    error: usersError,
    isPending: usersPending,
  } = useQuery({
    queryFn: () => searchUsers(debouncedValue),
    queryKey: ["users", debouncedValue],
  });

  const {
    data: posts,
    error: postsError,
    isPending: postsPending,
  } = useQuery({
    queryFn: () => searchPosts(debouncedValue),
    queryKey: ["posts", debouncedValue],
  });

  if (usersError) {
    console.error("Error searching users:", usersError);
    throw new Error("Error searching users:", { cause: usersError });
  }
  if (postsError) {
    console.error("Error searching posts:", postsError);
    throw new Error("Error searching posts:", { cause: postsError });
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
          <p className="text-2xl font-semibold">Users</p>
          {usersPending ? (
            <Loading />
          ) : users.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {users.map((user) => (
                <Link
                  className="bg-muted rounded-lg p-4 hover:bg-muted-foreground/25 transition-colors"
                  href={`/user/${user.username}`}
                  key={user.id}
                >
                  <UserBlock noLink profile={user} size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No users found</p>
          )}
          <Separator />
          <p className="text-2xl font-semibold">Posts</p>
          {postsPending ? (
            <Loading />
          ) : posts.length > 0 ? (
            <Masonry
              breakpointCols={{
                500: 1,
                700: 2,
                1100: 3,
                default: 4,
              }}
              className="flex -ml-4"
              columnClassName="pl-4"
            >
              {posts.map((post) => (
                <Link
                  className="bg-muted rounded-lg p-4 flex flex-col gap-4 mb-4"
                  href={`/post/${post.id}`}
                  key={post.id}
                >
                  <Image
                    alt={post.caption || "Image of the post"}
                    height={getImageHeight(post.image)}
                    src={post.image}
                    width={getImageWidth(post.image)}
                  />
                  <Separator />
                  <Comment
                    comment={post.caption}
                    createdAt={post.createdAt}
                    size={12}
                    user={post.user}
                  />
                </Link>
              ))}
            </Masonry>
          ) : (
            <p className="text-muted-foreground">No posts found</p>
          )}
        </div>
      )}
    </div>
  );
}

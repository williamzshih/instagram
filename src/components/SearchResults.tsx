"use client";

import { searchUsers, searchPosts } from "@/utils/actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function SearchResults({ q }: { q: string }) {
  const {
    data: users,
    isPending: isUsersPending,
    error: usersError,
  } = useQuery({
    queryKey: ["searchUsers", q],
    queryFn: () => searchUsers(q),
    placeholderData: keepPreviousData,
  });

  const {
    data: posts,
    isPending: isPostsPending,
    error: postsError,
  } = useQuery({
    queryKey: ["searchPosts", q],
    queryFn: () => searchPosts(q),
    placeholderData: keepPreviousData,
  });

  if (isUsersPending || isPostsPending) {
    return (
      <div className="flex flex-col p-4 w-3/4 gap-4">
        <p className="text-gray-500">Search results for: {q}</p>
        <Separator />
        <p className="text-lg font-bold">Users</p>
        {users && users.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.username}`}
                className="bg-gray-100 rounded-lg flex items-center justify-evenly p-2"
              >
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={user.avatar}
                    alt="User avatar"
                    className="object-cover"
                  />
                </Avatar>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p>{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No users found</p>
        )}
        <Separator />
        <p className="text-lg font-bold">Posts</p>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="bg-gray-100 rounded-lg flex flex-col items-center p-2 gap-2"
              >
                <div className="w-full bg-gray-100 rounded-lg flex items-center gap-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={post.user.avatar}
                      alt="User avatar"
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm">{post.user.name}</p>
                    <p className="text-xs text-gray-500">
                      @{post.user.username}
                    </p>
                  </div>
                </div>
                <Image
                  src={post.image}
                  alt="Post image"
                  width={384}
                  height={384}
                />
                <Separator />
                <p className="w-full text-left">{post.caption}</p>
                <p className="text-xs text-gray-500 w-full text-right">
                  {post.createdAt.toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No posts found</p>
        )}
      </div>
    );
  }

  if (usersError || postsError) {
    if (usersError) {
      console.error(`Error searching users: ${usersError.message}`);
      toast.error(`Error searching users: ${usersError.message}`);
    }
    if (postsError) {
      console.error(`Error searching posts: ${postsError.message}`);
      toast.error(`Error searching posts: ${postsError.message}`);
    }
    return (
      <div className="flex flex-col items-center justify-center p-4 w-3/4 gap-4 text-red-500">
        <p>{usersError && `Error searching users: ${usersError.message}`}</p>
        <p>{postsError && `Error searching posts: ${postsError.message}`}</p>
      </div>
    );
  }

  if (!q) {
    return;
  }

  return (
    <div className="flex flex-col p-4 w-3/4 gap-4">
      <p className="text-gray-500">Search results for: {q}</p>
      <Separator />
      <p className="text-lg font-bold">Users</p>
      {users.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/user/${user.username}`}
              className="bg-gray-100 rounded-lg flex items-center justify-evenly p-2"
            >
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={user.avatar}
                  alt="User avatar"
                  className="object-cover"
                />
              </Avatar>
              <div className="flex flex-col items-center justify-center gap-1">
                <p>{user.name}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No users found</p>
      )}
      <Separator />
      <p className="text-lg font-bold">Posts</p>
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="bg-gray-100 rounded-lg flex flex-col items-center p-2 gap-2"
            >
              <div className="w-full bg-gray-100 rounded-lg flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={post.user.avatar}
                    alt="User avatar"
                    className="object-cover"
                  />
                </Avatar>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm">{post.user.name}</p>
                  <p className="text-xs text-gray-500">@{post.user.username}</p>
                </div>
              </div>
              <Image
                src={post.image}
                alt="Post image"
                width={384}
                height={384}
              />
              <Separator />
              <p className="w-full text-left">{post.caption}</p>
              <p className="text-xs text-gray-500 w-full text-right">
                {post.createdAt.toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No posts found</p>
      )}
    </div>
  );
}

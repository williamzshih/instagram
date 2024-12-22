"use client";

import { searchUsers, searchPosts, getUser } from "@/utils/actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import UserHeader from "@/components/UserHeader";
import Comment from "@/components/Comment";
import { SyncLoader } from "react-spinners";

export default function SearchResults({ q }: { q: string }) {
  const {
    data: users,
    isPending: isUsersPending,
    error: usersError,
  } = useQuery({
    queryKey: ["users", "searchResults", q],
    queryFn: () => searchUsers(q),
    placeholderData: keepPreviousData,
  });

  const {
    data: posts,
    isPending: isPostsPending,
    error: postsError,
  } = useQuery({
    queryKey: ["posts", "searchResults", q],
    queryFn: () => searchPosts(q),
    placeholderData: keepPreviousData,
  });

  const {
    data: user,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ["user", "searchResults"],
    queryFn: () => getUser(),
  });

  if (!q) {
    return;
  }

  if (isUsersPending || isPostsPending || isUserPending) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <SyncLoader />
      </div>
    );
  }

  if (usersError || postsError || userError) {
    if (usersError) {
      console.error(usersError);
      toast.error(usersError as unknown as string);
    }
    if (postsError) {
      console.error(postsError);
      toast.error(postsError as unknown as string);
    }
    if (userError) {
      console.error(userError);
      toast.error(userError as unknown as string);
    }
    return (
      <div className="flex flex-col items-center justify-center p-4 gap-4 text-red-500">
        <p>{usersError as unknown as string}</p>
        <p>{postsError as unknown as string}</p>
        <p>{userError as unknown as string}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        User not found
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-4">
      <p className="text-gray-500">Search results for: {q}</p>
      <Separator />
      <p className="text-lg font-bold">Users</p>
      {users.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {users.map((searchedUser) => (
            <Link
              key={searchedUser.id}
              href={
                searchedUser.id === user.id
                  ? `/profile`
                  : `/user/${searchedUser.username}`
              }
              className="bg-gray-100 rounded-lg p-2"
            >
              <UserHeader user={searchedUser} size={24} justify="center" />
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
              className="bg-gray-100 rounded-lg p-2 flex flex-col gap-2"
            >
              <Image
                src={post.image}
                alt="Post image"
                width={384}
                height={384}
                className="rounded-lg"
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
        </div>
      ) : (
        <p className="text-sm text-gray-500">No posts found</p>
      )}
    </div>
  );
}

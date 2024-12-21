"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/actions";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import SignIn from "./sign-in/page";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    console.error(`Error fetching user: ${error.message}`);
    toast.error(`Error fetching user: ${error.message}`);
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>{error && `Error fetching user: ${error.message}`}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex gap-4 self-start">
        <div className="w-[96px] h-[96px] p-1 rounded-full border-2 flex items-center justify-center">
          <Plus size={30} />
        </div>
        {user.following.map((user) => (
          <div
            key={user.whoTheyreFollowing.id}
            className="flex flex-col items-center justify-center gap-1"
          >
            <div className="p-1 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red flex items-center justify-center">
              <div className="p-1 rounded-full bg-white">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={user.whoTheyreFollowing.avatar}
                    alt="User avatar"
                    className="object-cover"
                  />
                </Avatar>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {user.whoTheyreFollowing.username}
            </p>
          </div>
        ))}
      </div>
      <SignIn />
      <div className="flex flex-col items-center justify-center gap-4">
        {user.following
          .flatMap((user) => user.whoTheyreFollowing.posts)
          .map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="bg-gray-100 rounded-lg flex flex-col items-center p-2 gap-2 w-3/4"
            >
              <div className="w-full bg-gray-100 rounded-lg flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.avatar}
                    alt="User avatar"
                    className="object-cover"
                  />
                </Avatar>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
              <Image
                src={post.image}
                alt="Post image"
                width={3840}
                height={3840}
                className="rounded-lg"
              />
              <Separator />
              <p className="w-full text-left">{post.caption}</p>
              <p className="text-xs text-gray-500 w-full text-right">
                {post.createdAt.toLocaleDateString()}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings, BadgeCheck } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("posts");

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-between w-full mb-4">
          <Skeleton className="h-10 w-10" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-gray-300 to-gray-400 mb-4">
          <div className="p-1 bg-white rounded-full">
            <Skeleton className="w-40 h-40 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-7 w-48 mb-1" />
        <Skeleton className="h-7 w-48 mb-3" />
        <div className="flex items-center justify-center gap-2 mb-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching user:", error);
    toast.error("Error fetching user");
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        Error fetching user: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <Button size="icon" variant="ghost">
          <ChevronLeft />
        </Button>
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold">{user.username}</p>
          <BadgeCheck />
        </div>
        <Button size="icon" variant="ghost">
          <Link href="/settings">
            <Settings />
          </Link>
        </Button>
      </div>
      <div className="p-1 rounded-full flex items-center justify-center bg-gradient-to-tr from-ig-orange to-ig-red mb-4">
        <div className="p-1 bg-white rounded-full">
          <Avatar className="w-40 h-40 rounded-full">
            <AvatarImage
              src={user.avatar}
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover"
            />
          </Avatar>
        </div>
      </div>
      <p className="text-xl font-bold">{user.name}</p>
      <p className="text-lg mb-4">{user.bio}</p>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant={selectedTab === "posts" ? "default" : "ghost"}
          className="text-lg"
          onClick={() => setSelectedTab("posts")}
        >
          Posts
        </Button>
        <Button
          variant={selectedTab === "highlights" ? "default" : "ghost"}
          className="text-lg"
          onClick={() => setSelectedTab("highlights")}
        >
          Highlights
        </Button>
      </div>
      {selectedTab === "posts" && <PostsGrid posts={user.posts} />}
    </div>
  );
}

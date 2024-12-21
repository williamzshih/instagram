"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/actions";
import { toast } from "sonner";
import ProfilePicture from "@/components/ProfilePicture";

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState("posts");

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
        Loading...
      </div>
    );
  }

  if (error) {
    console.error("Error fetching user:", error);
    toast.error("Error fetching user");
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>Error fetching user: {error.message}</p>
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
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center justify-between w-full">
        <Button size="icon" className="invisible" />
        <p className="text-2xl font-bold">{user.username}</p>
        <Button size="icon" variant="ghost">
          <Link href="/settings">
            <Settings />
          </Link>
        </Button>
      </div>
      <ProfilePicture user={user} />
      <p className="text-xl font-bold">{user.name}</p>
      <p className="text-lg">{user.bio}</p>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={selectedTab === "posts" ? "default" : "ghost"}
          onClick={() => setSelectedTab("posts")}
          className="text-lg"
        >
          Posts
        </Button>
        <Button
          variant={selectedTab === "highlights" ? "default" : "ghost"}
          onClick={() => setSelectedTab("highlights")}
          className="text-lg"
        >
          Highlights
        </Button>
      </div>
      {selectedTab === "posts" && <PostsGrid posts={user.posts} />}
    </div>
  );
}

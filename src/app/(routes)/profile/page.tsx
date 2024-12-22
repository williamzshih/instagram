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
import { SyncLoader } from "react-spinners";

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState("posts");

  const {
    data: user,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ["user", "profilePage"],
    queryFn: () => getUser(),
  });

  if (isUserPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <SyncLoader />
      </div>
    );
  }

  if (userError) {
    console.error(userError);
    toast.error(userError as unknown as string);

    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
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
          variant={selectedTab === "bookmarks" ? "default" : "ghost"}
          onClick={() => setSelectedTab("bookmarks")}
          className="text-lg"
        >
          Bookmarks
        </Button>
      </div>
      {selectedTab === "posts" && <PostsGrid posts={user.posts} />}
      {selectedTab === "bookmarks" && (
        <PostsGrid posts={user.bookmarks.map((b) => b.post)} />
      )}
    </div>
  );
}

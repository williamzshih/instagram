"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import { Separator } from "@/components/ui/separator";
import ProfileInfo from "@/components/ProfileInfo";

export default function CurrentProfilePage({
  user,
}: {
  user: {
    bookmarks: {
      post: {
        id: string;
        image: string;
      };
    }[];
    posts: {
      id: string;
      image: string;
    }[];
    username: string;
    name: string;
    bio: string;
    avatar: string;
    followers: {
      id: string;
      user: {
        username: string;
        avatar: string;
        name: string;
      };
    }[];
    following: {
      id: string;
      following: {
        username: string;
        avatar: string;
        name: string;
      };
    }[];
  };
}) {
  const [selectedTab, setSelectedTab] = useState("posts");

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ProfileInfo user={user} isCurrentUser />
      <Separator />
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
      {selectedTab === "posts" ? (
        <PostsGrid posts={user.posts} />
      ) : (
        <PostsGrid posts={user.bookmarks.map((b) => b.post)} />
      )}
    </div>
  );
}

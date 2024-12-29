"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import { Separator } from "@/components/ui/separator";
import {
  User as UserType,
  Follow as FollowType,
  Post as PostType,
  Bookmark as BookmarkType,
} from "@prisma/client";
import UserProfileInfo from "./UserProfileInfo";

export default function ProfilePage({
  user,
}: {
  user: UserType & {
    followers: FollowType[];
    following: FollowType[];
    posts: PostType[];
    bookmarks: (BookmarkType & { post: PostType })[];
  };
}) {
  const [selectedTab, setSelectedTab] = useState("posts");

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <UserProfileInfo user={user} isCurrentUser />
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

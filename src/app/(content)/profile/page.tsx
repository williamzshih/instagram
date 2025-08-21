"use client";

import { useState } from "react";
import FollowStats from "@/components/FollowStats";
import GradientRing from "@/components/GradientRing";
import LinkImage from "@/components/LinkImage";
import PostGrid from "@/components/PostGrid";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

export default function Profile() {
  const [view, setView] = useState("posts");
  const user = useUserStore((state) => state.user);
  if (!user) return;

  return (
    <div className="flex flex-col gap-4 items-center">
      <ProfileHeader currentUser user={user} />
      <GradientRing>
        <LinkImage noLink size={40} user={user} />
      </GradientRing>
      <ProfileInfo user={user} />
      <FollowStats currentUser user={user} />
      <div className="flex gap-2">
        <Button
          className="text-lg cursor-pointer"
          onClick={() => setView("posts")}
          variant={view === "posts" ? "default" : "ghost"}
        >
          Posts
        </Button>
        <Button
          className="text-lg cursor-pointer"
          onClick={() => setView("likes")}
          variant={view === "likes" ? "default" : "ghost"}
        >
          Likes
        </Button>
        <Button
          className="text-lg cursor-pointer"
          onClick={() => setView("bookmarks")}
          variant={view === "bookmarks" ? "default" : "ghost"}
        >
          Bookmarks
        </Button>
      </div>
      {view === "posts" ? (
        user.posts.length > 0 ? (
          <PostGrid posts={user.posts} />
        ) : (
          <div className="text-muted-foreground">No posts yet</div>
        )
      ) : view === "likes" ? (
        user.likes.length > 0 ? (
          <PostGrid posts={user.likes} type="likes" />
        ) : (
          <div className="text-muted-foreground">No likes yet</div>
        )
      ) : user.bookmarks.length > 0 ? (
        <PostGrid posts={user.bookmarks} type="bookmarks" />
      ) : (
        <div className="text-muted-foreground">No bookmarks yet</div>
      )}
    </div>
  );
}

// TODO: add comments

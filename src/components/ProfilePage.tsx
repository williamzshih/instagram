"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import PostGrid from "@/components/PostGrid";
import ProfileInfo from "@/components/ProfileInfo";
import { useQuery } from "@tanstack/react-query";
import {
  getPosts,
  getLikes,
  getBookmarks,
  type Profile,
} from "@/actions/profile";
import Loading from "@/components/Loading";

// TODO: refactor types
export default function ProfilePage({ profile }: { profile: Profile }) {
  const [selectedTab, setSelectedTab] = useState("posts");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", profile.username],
    queryFn: () => getPosts(profile.username),
    enabled: selectedTab === "posts",
  });

  const { data: likes = [], isLoading: isLoadingLikes } = useQuery({
    queryKey: ["likes", profile.username],
    queryFn: () => getLikes(profile.username),
    enabled: selectedTab === "likes",
  });

  const { data: bookmarks = [], isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ["bookmarks", profile.username],
    queryFn: () => getBookmarks(profile.username),
    enabled: selectedTab === "bookmarks",
  });

  if (!mounted) return;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ProfileInfo profile={profile} />
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={selectedTab === "posts" ? "default" : "ghost"}
          onClick={() => setSelectedTab("posts")}
          className="text-lg cursor-pointer"
        >
          Posts
        </Button>
        <Button
          variant={selectedTab === "likes" ? "default" : "ghost"}
          onClick={() => setSelectedTab("likes")}
          className="text-lg cursor-pointer"
        >
          Likes
        </Button>
        <Button
          variant={selectedTab === "bookmarks" ? "default" : "ghost"}
          onClick={() => setSelectedTab("bookmarks")}
          className="text-lg cursor-pointer"
        >
          Bookmarks
        </Button>
      </div>
      {selectedTab === "posts" ? (
        isLoadingPosts ? (
          <Loading />
        ) : posts.length > 0 ? (
          <PostGrid posts={posts} type="posts" />
        ) : (
          <div className="text-muted-foreground">No posts yet</div>
        )
      ) : selectedTab === "likes" ? (
        isLoadingLikes ? (
          <Loading />
        ) : likes.length > 0 ? (
          <PostGrid posts={likes} type="likes" />
        ) : (
          <div className="text-muted-foreground">No likes yet</div>
        )
      ) : isLoadingBookmarks ? (
        <Loading />
      ) : bookmarks.length > 0 ? (
        <PostGrid posts={bookmarks} type="bookmarks" />
      ) : (
        <div className="text-muted-foreground">No bookmarks yet</div>
      )}
    </div>
  );
}

// TODO: add comments

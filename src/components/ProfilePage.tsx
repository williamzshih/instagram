"use client";

import { useQuery } from "@tanstack/react-query";
import { redirect, useSearchParams } from "next/navigation";
import { getBookmarks, getLikes, getPosts } from "@/actions/profile";
import Loading from "@/components/Loading";
import PostGrid from "@/components/PostGrid";
import ProfileInfo from "@/components/ProfileInfo";
import { Button } from "@/components/ui/button";

type Props = {
  currentUser?: boolean;
  following?: boolean;
  profile: {
    _count: {
      followers: number;
      following: number;
    };
    avatar: string;
    bio: string;
    createdAt: Date;
    id: string;
    name: string;
    username: string;
  };
};

export default function ProfilePage({
  currentUser,
  following,
  profile,
}: Props) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "posts";

  const {
    data: posts,
    error: postsError,
    isPending: postsPending,
  } = useQuery({
    enabled: view === "posts" || !currentUser,
    queryFn: () => getPosts(profile.id),
    queryKey: ["posts", profile.id],
  });

  const {
    data: likes,
    error: likesError,
    isPending: likesPending,
  } = useQuery({
    enabled: view === "likes" && currentUser,
    queryFn: () => getLikes(profile.id),
    queryKey: ["likes", profile.id],
  });

  const {
    data: bookmarks,
    error: bookmarksError,
    isPending: bookmarksPending,
  } = useQuery({
    enabled: view === "bookmarks" && currentUser,
    queryFn: () => getBookmarks(profile.id),
    queryKey: ["bookmarks", profile.id],
  });

  if (postsError) {
    console.error("Error getting posts:", postsError);
    throw new Error("Error getting posts:", { cause: postsError });
  }
  if (likesError) {
    console.error("Error getting likes:", likesError);
    throw new Error("Error getting likes:", { cause: likesError });
  }
  if (bookmarksError) {
    console.error("Error getting bookmarks:", bookmarksError);
    throw new Error("Error getting bookmarks:", { cause: bookmarksError });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ProfileInfo
        currentUser={currentUser}
        following={following}
        profile={profile}
      />
      {currentUser && (
        <div className="flex items-center justify-center gap-2">
          <Button
            className="text-lg cursor-pointer"
            onClick={() => redirect(`?view=posts`)}
            variant={view === "posts" ? "default" : "ghost"}
          >
            Posts
          </Button>
          <Button
            className="text-lg cursor-pointer"
            onClick={() => redirect(`?view=likes`)}
            variant={view === "likes" ? "default" : "ghost"}
          >
            Likes
          </Button>
          <Button
            className="text-lg cursor-pointer"
            onClick={() => redirect(`?view=bookmarks`)}
            variant={view === "bookmarks" ? "default" : "ghost"}
          >
            Bookmarks
          </Button>
        </div>
      )}
      {view === "posts" ? (
        postsPending ? (
          <Loading />
        ) : posts.length > 0 ? (
          <PostGrid posts={posts} type="posts" />
        ) : (
          <div className="text-muted-foreground">No posts yet</div>
        )
      ) : view === "likes" ? (
        likesPending ? (
          <Loading />
        ) : likes.length > 0 ? (
          <PostGrid posts={likes} type="likes" />
        ) : (
          <div className="text-muted-foreground">No likes yet</div>
        )
      ) : bookmarksPending ? (
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

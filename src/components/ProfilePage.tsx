"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";
import { redirect, useSearchParams } from "next/navigation";
import { getBookmarks, getLikes, getPosts } from "@/actions/user";
import FollowStats from "@/components/FollowStats";
import GradientRing from "@/components/GradientRing";
import PostGrid from "@/components/PostGrid";
import PostGridLoading from "@/components/PostGridLoading";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import ProfilePicture from "@/components/ProfilePicture";
import { Button } from "@/components/ui/button";

type Props = {
  user: User;
} & (
  | {
      currentUserId: string;
      initialFollow: boolean;
      type: "user";
    }
  | {
      type: "profile";
    }
);

export default function ProfilePage(props: Props) {
  const { type, user } = props;

  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "posts";

  const {
    data: posts,
    error: postsError,
    isPending: gettingPosts,
  } = useQuery({
    enabled: type === "user" || (type === "profile" && view === "posts"),
    queryFn: () => getPosts(user.id),
    queryKey: ["profilePage", "posts", user.id],
  });

  const {
    data: likes,
    error: likesError,
    isPending: gettingLikes,
  } = useQuery({
    enabled: type === "profile" && view === "likes",
    queryFn: () => getLikes(user.id),
    queryKey: ["profilePage", "likes", user.id],
  });

  const {
    data: bookmarks,
    error: bookmarksError,
    isPending: gettingBookmarks,
  } = useQuery({
    enabled: type === "profile" && view === "bookmarks",
    queryFn: () => getBookmarks(user.id),
    queryKey: ["profilePage", "bookmarks", user.id],
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
    <div className="flex flex-col items-center gap-4">
      <ProfileHeader {...props} />
      <GradientRing>
        <ProfilePicture size={40} user={user} />
      </GradientRing>
      <ProfileInfo user={user} />
      <FollowStats {...props} />
      {type === "profile" && (
        <div className="flex gap-2">
          <Button
            className="cursor-pointer text-lg"
            onClick={() => redirect("?view=posts")}
            variant={view === "posts" ? "default" : "ghost"}
          >
            Posts
          </Button>
          <Button
            className="cursor-pointer text-lg"
            onClick={() => redirect("?view=likes")}
            variant={view === "likes" ? "default" : "ghost"}
          >
            Likes
          </Button>
          <Button
            className="cursor-pointer text-lg"
            onClick={() => redirect("?view=bookmarks")}
            variant={view === "bookmarks" ? "default" : "ghost"}
          >
            Bookmarks
          </Button>
        </div>
      )}
      <div className="size-full text-center">
        {view === "posts" ? (
          gettingPosts ? (
            <PostGridLoading />
          ) : posts.length > 0 ? (
            <PostGrid posts={posts} />
          ) : (
            <div className="text-muted-foreground">No posts yet</div>
          )
        ) : view === "likes" ? (
          gettingLikes ? (
            <PostGridLoading />
          ) : likes.length > 0 ? (
            <PostGrid
              posts={likes.map((like) => ({
                ...like.post,
                createdAt: like.createdAt,
              }))}
              type="likes"
            />
          ) : (
            <div className="text-muted-foreground">No likes yet</div>
          )
        ) : gettingBookmarks ? (
          <PostGridLoading />
        ) : bookmarks.length > 0 ? (
          <PostGrid
            posts={bookmarks.map((bookmark) => ({
              ...bookmark.post,
              createdAt: bookmark.createdAt,
            }))}
            type="bookmarks"
          />
        ) : (
          <div className="text-muted-foreground">No bookmarks yet</div>
        )}
      </div>
    </div>
  );
}

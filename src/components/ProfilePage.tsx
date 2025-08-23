"use client";

import { User } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { toggleFollow } from "@/actions/user";
import FollowStats from "@/components/FollowStats";
import GradientRing from "@/components/GradientRing";
import PostGrid from "@/components/PostGrid";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import ProfilePicture from "@/components/ProfilePicture";
import { Button } from "@/components/ui/button";
import useToggle from "@/hooks/useToggle";

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

  const [view, setView] = useState("posts");
  const [followed, setFollowed] = useState(
    type === "user" ? props.initialFollow : false
  );
  const [followers, toggleFollowers] = useToggle(
    user.followers.length,
    user.followers.length +
      (type === "user" ? (props.initialFollow ? -1 : 1) : 0),
    user.followers.length
  );

  const handleFollow = async () => {
    try {
      if (type !== "user") return;
      setFollowed(!followed);
      toggleFollowers();
      await toggleFollow({
        followed,
        followeeId: user.id,
        followerId: props.currentUserId,
      });
      toast.success(followed ? "Unfollowed user" : "Followed user");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ProfileHeader {...props} />
      <GradientRing>
        <ProfilePicture size={40} user={user} />
      </GradientRing>
      <ProfileInfo user={user} />
      {type === "profile" ? (
        <FollowStats {...props} />
      ) : (
        <FollowStats followers={followers} {...props} />
      )}
      {type === "profile" ? (
        <div className="flex gap-2">
          <Button
            className="cursor-pointer text-lg"
            onClick={() => setView("posts")}
            variant={view === "posts" ? "default" : "ghost"}
          >
            Posts
          </Button>
          <Button
            className="cursor-pointer text-lg"
            onClick={() => setView("likes")}
            variant={view === "likes" ? "default" : "ghost"}
          >
            Likes
          </Button>
          <Button
            className="cursor-pointer text-lg"
            onClick={() => setView("bookmarks")}
            variant={view === "bookmarks" ? "default" : "ghost"}
          >
            Bookmarks
          </Button>
        </div>
      ) : followed ? (
        <Button
          className="from-ig-orange to-ig-red cursor-pointer bg-linear-to-tr"
          onClick={handleFollow}
          onMouseEnter={(e) => (e.currentTarget.textContent = "Unfollow")}
          onMouseLeave={(e) => (e.currentTarget.textContent = "Following")}
        >
          Following
        </Button>
      ) : (
        <Button className="cursor-pointer" onClick={handleFollow}>
          Follow
        </Button>
      )}
      <div className="size-full text-center">
        {view === "posts" ? (
          user.posts.length > 0 ? (
            <PostGrid posts={user.posts} />
          ) : (
            <div className="text-muted-foreground">No posts yet</div>
          )
        ) : view === "likes" ? (
          user.likes.length > 0 ? (
            <PostGrid
              posts={user.likes.map((like) => ({
                ...like.post,
                createdAt: like.createdAt,
              }))}
              type="likes"
            />
          ) : (
            <div className="text-muted-foreground">No likes yet</div>
          )
        ) : user.bookmarks.length > 0 ? (
          <PostGrid
            posts={user.bookmarks.map((bookmark) => ({
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

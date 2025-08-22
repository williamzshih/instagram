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
  currentUser?: boolean;
  currentUserId?: string;
  initialFollowing?: boolean;
  user: User;
};

export default function ProfilePage({
  currentUser,
  currentUserId,
  initialFollowing = false,
  user,
}: Props) {
  const [view, setView] = useState("posts");
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, toggleFollowers] = useToggle(
    user.followers.length,
    user.followers.length + (initialFollowing ? -1 : 1),
    user.followers.length
  );

  const handleFollow = async () => {
    try {
      if (!currentUserId) return;
      setFollowing(!following);
      toggleFollowers();
      await toggleFollow({
        following,
        realFolloweeId: user.id,
        realFollowerId: currentUserId,
      });
      toast.success(following ? "Unfollowed user" : "Followed user");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ProfileHeader currentUser={currentUser} user={user} />
      <GradientRing>
        <ProfilePicture size={40} user={user} />
      </GradientRing>
      <ProfileInfo user={user} />
      <FollowStats
        currentUser={currentUser}
        currentUserId={currentUserId}
        followers={followers}
        user={user}
      />
      {currentUser ? (
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
      ) : following ? (
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

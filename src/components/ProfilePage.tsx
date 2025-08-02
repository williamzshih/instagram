"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostGrid from "@/components/PostGrid";
import ProfileInfo from "@/components/ProfileInfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  getLikes,
  getBookmarks,
  checkFollow,
  toggleFollow,
  type Follower,
} from "@/actions/profile";
import Loading from "@/components/Loading";

type Props = {
  profile: {
    id: string;
    username: string;
    name: string;
    bio: string;
    avatar: string;
    createdAt: Date;
    _count: {
      followers: number;
      following: number;
    };
  };
  isCurrentUser?: boolean;
  isFollowingInitial?: boolean;
};

export default function ProfilePage({
  profile,
  isCurrentUser,
  isFollowingInitial,
}: Props) {
  const [selectedTab, setSelectedTab] = useState("posts");

  // TODO: add error handling, isPending?
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", profile.id],
    queryFn: () => getPosts(profile.id),
    enabled: selectedTab === "posts" || !isCurrentUser,
  });

  const { data: likes = [], isLoading: isLoadingLikes } = useQuery({
    queryKey: ["likes", profile.id],
    queryFn: () => getLikes(profile.id),
    enabled: selectedTab === "likes" && isCurrentUser,
  });

  const { data: bookmarks = [], isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ["bookmarks", profile.id],
    queryFn: () => getBookmarks(profile.id),
    enabled: selectedTab === "bookmarks" && isCurrentUser,
  });

  const { data: isFollowing = isFollowingInitial } = useQuery({
    queryKey: ["isFollowing", profile.id],
    queryFn: () => checkFollow(profile.id),
    enabled: !isCurrentUser,
  });

  const queryClient = useQueryClient();

  const { mutate: toggleFollowMutation } = useMutation({
    mutationFn: () => toggleFollow(profile.id, !!isFollowing),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFollowing", profile.id],
      });
      const previousIsFollowing = queryClient.getQueryData([
        "isFollowing",
        profile.id,
      ]);
      queryClient.setQueryData(
        ["isFollowing", profile.id],
        (old: boolean) => !old
      );

      await queryClient.cancelQueries({
        queryKey: ["followers", profile.id],
      });
      const previousFollowers = queryClient.getQueryData([
        "followers",
        profile.id,
      ]);
      queryClient.setQueryData(
        ["followers", profile.id],
        (old: { followers: Follower[]; length: number }) => ({
          followers: old.followers,
          length: old.length + (isFollowing ? -1 : 1),
        })
      );

      return { previousIsFollowing, previousFollowers };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["isFollowing", profile.id],
        context?.previousIsFollowing
      );
      queryClient.setQueryData(
        ["followers", profile.id],
        context?.previousFollowers
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", profile.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["followers", profile.id],
      });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ProfileInfo profile={profile} isCurrentUser={isCurrentUser} />
      {isCurrentUser ? (
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
      ) : isFollowing ? (
        <Button
          className="bg-linear-to-tr from-ig-orange to-ig-red cursor-pointer"
          onClick={() => toggleFollowMutation()}
          onMouseEnter={(e) => (e.currentTarget.textContent = "Unfollow")}
          onMouseLeave={(e) => (e.currentTarget.textContent = "Following")}
        >
          Following
        </Button>
      ) : (
        <Button
          className="cursor-pointer"
          onClick={() => toggleFollowMutation()}
        >
          Follow
        </Button>
      )}
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

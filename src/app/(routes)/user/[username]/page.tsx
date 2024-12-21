"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByUsername, toggleFollow, getFollow } from "@/utils/actions";
import { toast } from "sonner";
import { Follow as FollowType } from "@prisma/client";

export default function User({ params }: { params: { username: string } }) {
  const [selectedTab, setSelectedTab] = useState("posts");
  const queryClient = useQueryClient();

  const {
    data: otherUser,
    isPending: isOtherUserPending,
    error: otherUserError,
  } = useQuery({
    queryKey: ["otherUser", params.username],
    queryFn: () => getUserByUsername(params.username),
  });

  const {
    data: follow,
    isPending: isFollowPending,
    error: followError,
  } = useQuery({
    queryKey: ["follow", params.username],
    queryFn: () => getFollow(params.username),
  });

  const { mutate } = useMutation({
    mutationFn: (follow: FollowType | null) =>
      toggleFollow(follow, params.username),
    onMutate: async (follow) => {
      await queryClient.cancelQueries({
        queryKey: ["follow", params.username],
      });

      const previousFollow = queryClient.getQueryData([
        "follow",
        params.username,
      ]);

      queryClient.setQueryData(["follow", params.username], () =>
        follow ? null : {}
      );

      return { previousFollow };
    },
    onError: (err, _, context) => {
      console.error(`Error toggling follow: ${err.message}`);
      toast.error(`Error toggling follow: ${err.message}`);

      queryClient.setQueryData(
        ["follow", params.username],
        context?.previousFollow
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["follow", params.username] });
    },
  });

  if (isOtherUserPending || isFollowPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  if (otherUserError || followError) {
    if (otherUserError) {
      console.error(`Error fetching other user: ${otherUserError.message}`);
      toast.error(`Error fetching other user: ${otherUserError.message}`);
    }
    if (followError) {
      console.error(`Error fetching follow: ${followError.message}`);
      toast.error(`Error fetching follow: ${followError.message}`);
    }
    return (
      <div className="flex flex-col items-center justify-center p-4 gap-4 text-red-500">
        <p>
          {otherUserError &&
            `Error fetching other user: ${otherUserError.message}`}
        </p>
        <p>{followError && `Error fetching follow: ${followError.message}`}</p>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>Other user not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center justify-between w-full">
        <Button size="icon" className="invisible" />
        <p className="text-2xl font-bold">{params.username}</p>
        <Button size="icon" className="invisible" />
      </div>
      <div className="p-1 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red flex items-center justify-center">
        <div className="p-1 rounded-full bg-white">
          <Avatar className="w-40 h-40">
            <AvatarImage
              src={otherUser.avatar}
              alt="User avatar"
              className="object-cover"
            />
          </Avatar>
        </div>
      </div>
      <p className="text-xl font-bold">{otherUser.name}</p>
      <p className="text-lg">{otherUser.bio}</p>
      <Button
        className={
          follow ? "bg-gradient-to-tr from-ig-orange to-ig-red text-white" : ""
        }
        onClick={() => mutate(follow)}
        {...(follow
          ? {
              onMouseEnter: (e) => (e.currentTarget.textContent = "Unfollow"),
              onMouseLeave: (e) => (e.currentTarget.textContent = "Following"),
            }
          : {})}
      >
        {follow ? "Following" : "Follow"}
      </Button>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={selectedTab === "posts" ? "default" : "ghost"}
          onClick={() => setSelectedTab("posts")}
          className="text-lg"
        >
          Posts
        </Button>
        <Button
          variant={selectedTab === "highlights" ? "default" : "ghost"}
          onClick={() => setSelectedTab("highlights")}
          className="text-lg"
        >
          Highlights
        </Button>
      </div>
      {selectedTab === "posts" && <PostsGrid posts={otherUser.posts} />}
    </div>
  );
}

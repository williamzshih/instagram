"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByUsername, toggleFollow, getUser } from "@/utils/actions";
import { toast } from "sonner";
import { Follow as FollowType, User as UserType } from "@prisma/client";
import ProfilePicture from "@/components/ProfilePicture";

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
    data: currentUser,
    isPending: isCurrentUserPending,
    error: currentUserError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getUser(),
  });

  const { mutate } = useMutation({
    mutationFn: (follow: FollowType | undefined) =>
      toggleFollow(follow, params.username),
    onMutate: async (follow) => {
      await queryClient.cancelQueries({
        queryKey: ["otherUser", params.username],
      });

      const previousOtherUser = queryClient.getQueryData([
        "otherUser",
        params.username,
      ]);

      queryClient.setQueryData(
        ["otherUser", params.username],
        (
          old: UserType & { followers: (FollowType & { user: UserType })[] }
        ) => ({
          ...old,
          followers: follow
            ? old.followers.filter((f) => f.id !== follow.id)
            : [...old.followers, { user: currentUser }],
        })
      );

      return { previousOtherUser };
    },
    onError: (error, _, context) => {
      console.error("Error toggling follow", error);
      toast.error("Error toggling follow");

      queryClient.setQueryData(
        ["otherUser", params.username],
        context?.previousOtherUser
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["otherUser", params.username],
      });
    },
  });

  if (isOtherUserPending || isCurrentUserPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  if (otherUserError || currentUserError) {
    if (otherUserError) {
      console.error("Error fetching other user", otherUserError);
      toast.error("Error fetching other user");
    }
    if (currentUserError) {
      console.error("Error fetching current user", currentUserError);
      toast.error("Error fetching current user");
    }
    return (
      <div className="flex flex-col items-center justify-center p-4 gap-4 text-red-500">
        <p>
          {otherUserError &&
            `Error fetching other user: ${otherUserError.message}`}
        </p>
        <p>
          {currentUserError &&
            `Error fetching current user: ${currentUserError.message}`}
        </p>
      </div>
    );
  }

  if (!otherUser || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        Other user not found
      </div>
    );
  }

  const follow = otherUser.followers.find((f) => f.user.id === currentUser.id);

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center justify-between w-full">
        <Button size="icon" className="invisible" />
        <p className="text-2xl font-bold">{params.username}</p>
        <Button size="icon" className="invisible" />
      </div>
      <ProfilePicture user={otherUser} />
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
      </div>
      {selectedTab === "posts" && <PostsGrid posts={otherUser.posts} />}
    </div>
  );
}

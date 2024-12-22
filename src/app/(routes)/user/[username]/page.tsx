"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostsGrid from "@/components/PostsGrid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByUsername, toggleFollow, getUser } from "@/utils/actions";
import { toast } from "sonner";
import { Follow as FollowType, User as UserType } from "@prisma/client";
import GradientAvatar from "@/components/GradientAvatar";
import { SyncLoader } from "react-spinners";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function UserPage({ params }: { params: { username: string } }) {
  const [selectedTab, setSelectedTab] = useState("posts");
  const queryClient = useQueryClient();

  const {
    data: otherUser,
    isPending: isOtherUserPending,
    error: otherUserError,
  } = useQuery({
    queryKey: ["otherUser", "userPage", params.username],
    queryFn: () => getUserByUsername(params.username),
  });

  const {
    data: currentUser,
    isPending: isCurrentUserPending,
    error: currentUserError,
  } = useQuery({
    queryKey: ["currentUser", "userPage"],
    queryFn: () => getUser(),
  });

  const { mutate: toggleFollowMutation } = useMutation({
    mutationFn: (follow: FollowType | undefined) =>
      toggleFollow(follow, params.username),
    onMutate: async (follow) => {
      await queryClient.cancelQueries({
        queryKey: ["otherUser", "userPage", params.username],
      });

      const previousOtherUser = queryClient.getQueryData([
        "otherUser",
        "userPage",
        params.username,
      ]);

      queryClient.setQueryData(
        ["otherUser", "userPage", params.username],
        (
          old: UserType & { followers: (FollowType & { user: UserType })[] }
        ) => ({
          ...old,
          followers: follow
            ? old.followers.filter((f) => f.id !== follow.id)
            : [...old.followers, { user: { id: currentUser?.id } }],
        })
      );

      return { previousOtherUser };
    },
    onError: (error, _, context) => {
      console.error(error);
      toast.error(error as unknown as string);

      queryClient.setQueryData(
        ["otherUser", "userPage", params.username],
        context?.previousOtherUser
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["otherUser", "userPage", params.username],
      });
    },
  });

  if (isOtherUserPending || isCurrentUserPending) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <SyncLoader />
      </div>
    );
  }

  if (otherUserError || currentUserError) {
    if (otherUserError) {
      console.error(otherUserError);
      toast.error(otherUserError as unknown as string);
    }
    if (currentUserError) {
      console.error(currentUserError);
      toast.error(currentUserError as unknown as string);
    }

    return (
      <div className="flex flex-col items-center justify-center p-4 gap-4 text-red-500">
        <p>{otherUserError as unknown as string}</p>
        <p>{currentUserError as unknown as string}</p>
      </div>
    );
  }

  if (!otherUser || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        User not found
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
      <GradientAvatar user={otherUser} size={40} />
      <p className="text-xl font-bold">{otherUser.name}</p>
      <p className="text-lg">{otherUser.bio}</p>
      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" className="w-fit h-fit">
          <Link href={`/user/${params.username}/followers`}>
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-bold">
                {otherUser.followers.length === 1 ? "Follower" : "Followers"}
              </p>
              <p>Followers</p>
            </div>
          </Link>
        </Button>
        <Button variant="ghost" className="w-fit h-fit">
          <Link href={`/user/${params.username}/following`}>
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-bold">{otherUser.following.length}</p>
              <p>Following</p>
            </div>
          </Link>
        </Button>
      </div>
      <Button
        className={
          follow ? "bg-gradient-to-tr from-ig-orange to-ig-red text-white" : ""
        }
        onClick={() => toggleFollowMutation(follow)}
        {...(follow
          ? {
              onMouseEnter: (e) => (e.currentTarget.textContent = "Unfollow"),
              onMouseLeave: (e) => (e.currentTarget.textContent = "Following"),
            }
          : {})}
      >
        {follow ? "Following" : "Follow"}
      </Button>
      <Separator />
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

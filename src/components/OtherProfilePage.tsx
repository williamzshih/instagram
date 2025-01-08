"use client";

import { Button } from "@/components/ui/button";
import PostsGrid from "@/components/PostsGrid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByUsername } from "@/actions/user";
import { toggleFollow } from "@/actions/toggle";
import { toast } from "sonner";
import { Follow as FollowType, User as UserType } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import OtherProfilePageSkeleton from "@/components/OtherProfilePageSkeleton";
import ProfileInfo from "@/components/ProfileInfo";

export default function OtherProfilePage({
  otherUsername,
  currentUserId,
}: {
  otherUsername: string;
  currentUserId: string;
}) {
  const queryClient = useQueryClient();

  const {
    data: otherUser,
    isPending,
    error,
  } = useQuery({
    queryKey: ["otherUser", otherUsername],
    queryFn: () => getUserByUsername(otherUsername),
  });

  const { mutate: toggleFollowMutation } = useMutation({
    mutationFn: () => toggleFollow(follow?.id, otherUsername),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["otherUser", otherUsername],
      });
      const previousOtherUser = queryClient.getQueryData([
        "otherUser",
        otherUsername,
      ]);
      queryClient.setQueryData(
        ["otherUser", otherUsername],
        (
          old: UserType & { followers: (FollowType & { user: UserType })[] }
        ) => ({
          ...old,
          followers: follow
            ? old.followers.filter((f) => f.id !== follow.id)
            : [...old.followers, { user: { id: currentUserId } }],
        })
      );
      return { previousOtherUser };
    },
    onError: (error, _, context) => {
      toast.error(error.message);
      queryClient.setQueryData(
        ["otherUser", otherUsername],
        context?.previousOtherUser
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["otherUser", otherUsername],
      });
    },
  });

  if (isPending) {
    return <OtherProfilePageSkeleton />;
  }

  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }

  if (!otherUser) {
    return <div>Other user not found</div>;
  }

  const follow = otherUser.followers.find((f) => f.user.id === currentUserId);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ProfileInfo user={otherUser} />
      {follow ? (
        <Button
          className="bg-gradient-to-tr from-ig-orange to-ig-red text-white"
          onClick={() => toggleFollowMutation()}
          onMouseEnter={(e) => (e.currentTarget.textContent = "Unfollow")}
          onMouseLeave={(e) => (e.currentTarget.textContent = "Following")}
        >
          Following
        </Button>
      ) : (
        <Button onClick={() => toggleFollowMutation()}>Follow</Button>
      )}
      <Separator />
      <PostsGrid posts={otherUser.posts} />
    </div>
  );
}

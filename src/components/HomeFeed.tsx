"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import GradientAvatar from "@/components/GradientAvatar";
import Post from "@/app/(routes)/post/[id]/page";
import HomeFeedSkeleton from "@/components/HomeFeedSkeleton";

export default function HomeFeed() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  if (isPending) {
    return <HomeFeedSkeleton />;
  }

  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center">
          <Plus size={20} />
        </div>
        {user.following.map((follow) => (
          <div
            key={follow.id}
            className="flex flex-col items-center justify-center gap-1"
          >
            <GradientAvatar user={follow.whoTheyreFollowing} size={16} />
            <p className="text-sm text-muted-foreground">
              {follow.whoTheyreFollowing.username}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {user.following
          .flatMap((follow) => follow.whoTheyreFollowing.posts)
          .map((post) => (
            <Post
              key={post.id}
              params={{ id: post.id }}
              searchParams={{ from: "homeFeed" }}
              user={user}
            />
          ))}
      </div>
    </div>
  );
}

"use client";

import { Plus } from "lucide-react";
import GradientAvatar from "@/components/GradientAvatar";
import Post from "@/app/(routes)/post/[id]/page";

import {
  User as UserType,
  Follow as FollowType,
  Post as PostType,
} from "@prisma/client";

export default function HomeFeed({
  user,
}: {
  user: UserType & {
    following: (FollowType & {
      whoTheyreFollowing: UserType & { posts: PostType[] };
    })[];
  };
}) {
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

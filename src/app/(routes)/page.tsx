"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import GradientAvatar from "@/components/GradientAvatar";
import Post from "./post/[id]/page";
import { SyncLoader } from "react-spinners";

export default function HomePage() {
  const {
    data: user,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ["user", "homePage"],
    queryFn: () => getUser(),
  });

  if (isUserPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <SyncLoader />
      </div>
    );
  }

  if (userError) {
    console.error(userError);
    toast.error(userError as unknown as string);

    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        {userError as unknown as string}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        User not found
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex gap-4 self-start">
        <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center">
          <Plus size={24} />
        </div>
        {user.following.map((user) => (
          <div
            key={user.whoTheyreFollowing.id}
            className="flex flex-col items-center justify-center gap-1"
          >
            <GradientAvatar user={user.whoTheyreFollowing} size={20} />
            <p className="text-sm text-gray-500">
              {user.whoTheyreFollowing.username}
            </p>
          </div>
        ))}
      </div>
      {user.following
        .flatMap((user) => user.whoTheyreFollowing.posts)
        .map((post) => (
          <Post key={post.id} params={{ id: post.id }} fromHome />
        ))}
    </div>
  );
}

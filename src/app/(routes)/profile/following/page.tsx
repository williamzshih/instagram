"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/actions";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";
import UserHeader from "@/components/UserHeader";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function FollowingPage() {
  const {
    data: user,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ["user", "followingPage"],
    queryFn: () => getUser(),
  });

  if (isUserPending) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
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
      <p className="text-2xl font-bold self-start">Following</p>
      <Separator />
      {user.following.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 w-full">
          {user.following.map((follow) => (
            <div
              key={follow.id}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <UserHeader
                user={follow.whoTheyreFollowing}
                size={16}
                justify="center"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Not following anyone yet</p>
      )}
    </div>
  );
}

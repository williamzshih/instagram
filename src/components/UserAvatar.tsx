"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/utils/actions";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";

export default function UserAvatar({
  user,
  size,
}: {
  user: UserType;
  size: number;
}) {
  const router = useRouter();

  const {
    data: session,
    isPending,
    error,
  } = useQuery({
    queryKey: ["session", "userAvatar"],
    queryFn: () => getSession(),
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <SyncLoader />
      </div>
    );
  }

  if (error) {
    console.error(error);
    toast.error(error as unknown as string);

    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        {error as unknown as string}
      </div>
    );
  }

  const sizeClass =
    size === 12
      ? "w-12 h-12"
      : size === 16
      ? "w-16 h-16"
      : size === 20
      ? "w-20 h-20"
      : size === 24
      ? "w-24 h-24"
      : "w-40 h-40";

  return (
    <Avatar
      className={`${sizeClass} cursor-pointer`}
      onClick={() => {
        if (session?.user?.email === user.email) {
          router.push(`/profile`);
        } else {
          router.push(`/user/${user.username}`);
        }
      }}
    >
      <AvatarImage
        src={user.avatar}
        alt="User avatar"
        className="object-cover"
      />
    </Avatar>
  );
}

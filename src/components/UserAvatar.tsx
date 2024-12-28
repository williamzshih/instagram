import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@prisma/client";
import Link from "next/link";

export default function UserAvatar({
  user,
  size,
}: {
  user: UserType;
  size: number;
}) {
  const sizeClass =
    size === 10
      ? "w-10 h-10"
      : size === 12
      ? "w-12 h-12"
      : size === 16
      ? "w-16 h-16"
      : size === 20
      ? "w-20 h-20"
      : size === 24
      ? "w-24 h-24"
      : "w-40 h-40";

  return (
    <Link href={`/user/${user.username}`}>
      <Avatar className={sizeClass}>
        <AvatarImage
          src={user.avatar}
          alt={`${user.username} avatar`}
          className="object-cover"
        />
      </Avatar>
    </Link>
  );
}

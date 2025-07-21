import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export type LinkAvatarProps = {
  user: {
    username: string;
    avatar: string;
  };
  size: number;
};

export default function LinkAvatar({ user, size }: LinkAvatarProps) {
  // TODO: fix sizes
  const sizeClass =
    size === 10
      ? "w-10 h-10"
      : size === 12
      ? "w-12 h-12"
      : size === 16
      ? "w-16 h-16"
      : size === 40
      ? "w-40 h-40"
      : "w-10 h-10";

  return (
    <Link href={`/user/${user.username}`} className="rounded-full block">
      <Avatar className={sizeClass}>
        <AvatarImage
          src={user.avatar}
          alt={`${user.username}'s avatar`}
          className="object-cover rounded-full"
        />
      </Avatar>
    </Link>
  );
}

// TODO: remove unnecessary Tailwind classes

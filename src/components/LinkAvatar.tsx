import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  noLink?: boolean;
  profile: {
    avatar: string;
    username: string;
  };
  profilePage?: boolean;
  size: number;
};

export default function LinkAvatar({
  noLink,
  profile,
  profilePage,
  size,
}: Props) {
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

  return noLink || profilePage ? (
    <Avatar className={sizeClass}>
      <AvatarImage
        alt={`@${profile.username}'s avatar`}
        className="object-cover rounded-full"
        src={profile.avatar}
      />
    </Avatar>
  ) : (
    <Link className="rounded-full block" href={`/user/${profile.username}`}>
      <Avatar className={sizeClass}>
        <AvatarImage
          alt={`@${profile.username}'s avatar`}
          className="object-cover rounded-full"
          src={profile.avatar}
        />
      </Avatar>
    </Link>
  );
}

// TODO: remove unnecessary Tailwind classes

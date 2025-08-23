import { User } from "next-auth";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/store/user";

type Props = {
  link?: boolean;
  size: number;
  user: Pick<User, "image" | "username">;
};

export default function ProfilePicture({ link, size, user }: Props) {
  const currentUsername = useUserStore((state) => state.user?.username);
  if (!currentUsername) return;

  const sizes: Record<number, string> = {
    12: "size-12",
    16: "size-16",
    40: "size-40",
  };

  const who =
    currentUsername === user.username ? "Your" : `@${user.username}'s`;

  return link ? (
    <Link className="size-fit rounded-full" href={`/user/${user.username}`}>
      <Avatar className={sizes[size]}>
        <AvatarImage alt={`${who} profile picture`} src={user.image} />
      </Avatar>
    </Link>
  ) : (
    <Avatar className={sizes[size]}>
      <AvatarImage alt={`${who} profile picture`} src={user.image} />
    </Avatar>
  );
}

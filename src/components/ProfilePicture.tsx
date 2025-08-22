import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  link?: boolean;
  size: number;
  user: {
    image?: null | string;
    username: string;
  };
};

export default function ProfilePicture({ link, size, user }: Props) {
  const sizes: Record<number, string> = {
    12: "size-12",
    16: "size-16",
    40: "size-40",
  };

  return link ? (
    <Link className="size-fit rounded-full" href={`/user/${user.username}`}>
      <Avatar className={sizes[size]}>
        <AvatarImage
          alt={`@${user.username}'s profile picture`}
          src={
            user.image ||
            "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
          }
        />
      </Avatar>
    </Link>
  ) : (
    <Avatar className={sizes[size]}>
      <AvatarImage
        alt={`@${user.username}'s profile picture`}
        src={
          user.image ||
          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
        }
      />
    </Avatar>
  );
}

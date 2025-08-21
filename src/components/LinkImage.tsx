import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  noLink?: boolean;
  profilePage?: boolean;
  size: number;
  user: {
    image?: null | string;
    username: string;
  };
};

export default function LinkImage({ noLink, profilePage, size, user }: Props) {
  return noLink || profilePage ? (
    <Avatar className={`size-${size}`}>
      <AvatarImage
        alt={`@${user.username}'s profile picture`}
        src={
          user.image ||
          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
        }
      />
    </Avatar>
  ) : (
    <Link className="rounded-full size-fit" href={`/user/${user.username}`}>
      <Avatar className={`size-${size}`}>
        <AvatarImage
          alt={`@${user.username}'s profile picture`}
          src={
            user.image ||
            "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
          }
        />
      </Avatar>
    </Link>
  );
}

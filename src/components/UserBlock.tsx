import { User } from "next-auth";
import ProfilePicture from "@/components/ProfilePicture";

type Props = {
  link?: boolean;
  size: number;
  user: Pick<User, "image" | "name" | "username">;
};

export default function UserBlock({ link, size, user }: Props) {
  return (
    <div className="flex items-center gap-4">
      <ProfilePicture link={link} size={size} user={user} />
      <div>
        {user.name}
        <p className="text-muted-foreground text-sm">@{user.username}</p>
      </div>
    </div>
  );
}

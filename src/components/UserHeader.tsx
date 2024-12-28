import { User as UserType } from "@prisma/client";
import UserAvatar from "@/components/UserAvatar";

export default function UserHeader({
  user,
  size,
}: {
  user: UserType;
  size: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={user} size={size} />
      <div className="flex flex-col">
        <p>{user.name}</p>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
    </div>
  );
}

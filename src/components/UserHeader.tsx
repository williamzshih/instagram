import { User as UserType } from "@prisma/client";
import UserAvatar from "@/components/UserAvatar";

export default function UserHeader({
  user,
  size,
  justify,
}: {
  user: UserType;
  size: number;
  justify?: string;
}) {
  return (
    <div className={`flex items-center gap-2 justify-${justify}`}>
      <UserAvatar user={user} size={size} />
      <div className="flex flex-col items-center justify-center">
        <p>{user.name}</p>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>
    </div>
  );
}

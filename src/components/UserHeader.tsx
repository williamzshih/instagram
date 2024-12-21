import { User as UserType } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function UserHeader({ user }: { user: UserType }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-16 h-16">
        <AvatarImage
          src={user.avatar}
          alt="User avatar"
          className="object-cover"
        />
      </Avatar>
      <div className="flex flex-col items-center justify-center">
        <p>{user.name}</p>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>
    </div>
  );
}

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@prisma/client";

export default function UserAvatar({
  user,
  size,
}: {
  user: UserType;
  size: number;
}) {
  return (
    <Avatar className={`w-${size} h-${size}`}>
      <AvatarImage
        src={user.avatar}
        alt="User avatar"
        className="object-cover"
      />
    </Avatar>
  );
}

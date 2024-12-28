import { User as UserType } from "@prisma/client";
import UserAvatar from "@/components/UserAvatar";

export default function GradientAvatar({
  user,
  size,
}: {
  user: UserType;
  size: number;
}) {
  return (
    <div className="p-1 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red flex items-center justify-center">
      <div className="p-1 rounded-full bg-background">
        <UserAvatar user={user} size={size} />
      </div>
    </div>
  );
}

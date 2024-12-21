import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

export default function ProfilePicture({ user }: { user: User }) {
  return (
    <div className="p-1 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red flex items-center justify-center">
      <div className="p-1 rounded-full bg-white">
        <Avatar className="w-40 h-40">
          <AvatarImage
            src={user.avatar}
            alt="User avatar"
            className="object-cover"
          />
        </Avatar>
      </div>
    </div>
  );
}

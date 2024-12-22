import { User as UserType } from "@prisma/client";
import UserHeader from "@/components/UserHeader";

export default function Comment({
  user,
  comment,
  createdAt,
  size,
}: {
  user: UserType;
  comment: string;
  createdAt: Date;
  size: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <UserHeader user={user} size={size} />
      <p className="bg-gray-100 p-2 rounded-lg">{comment}</p>
      <div className="text-sm text-gray-500 text-right">
        {createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}

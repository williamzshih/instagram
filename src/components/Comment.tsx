import { User as UserType } from "@prisma/client";
import UserHeader from "@/components/UserHeader";

export default function Comment({
  user,
  comment,
  createdAt,
}: {
  user: UserType;
  comment: string;
  createdAt: Date;
}) {
  return (
    <div className="flex flex-col gap-4">
      <UserHeader user={user} />
      <p className="bg-gray-100 p-2 rounded-lg">{comment}</p>
      <div className="text-sm text-gray-500 text-right">
        {createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}

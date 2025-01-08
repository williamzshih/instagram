import UserHeader from "@/components/UserHeader";
import { formatDistanceToNow } from "date-fns";

export default function Comment({
  user,
  comment,
  createdAt,
  size,
}: {
  user: {
    username: string;
    avatar: string;
    name: string;
  };
  comment: string;
  createdAt: Date;
  size: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <UserHeader user={user} size={size} />
      {comment && <p className="bg-muted p-2 rounded-lg">{comment}</p>}
      <div className="text-sm text-muted-foreground text-right">
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
        })}
      </div>
    </div>
  );
}

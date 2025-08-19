import { formatDistanceToNow } from "date-fns";
import UserBlock from "@/components/UserBlock";

type Props = {
  comment: string;
  createdAt: Date;
  size: number;
  user: {
    avatar: string;
    name: string;
    username: string;
  };
};

export default function Comment({ comment, createdAt, size, user }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <UserBlock profile={user} size={size} />
      {comment && <p className="bg-muted p-2 rounded-lg">{comment}</p>}
      <div className="text-sm text-muted-foreground text-right">
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
        })}
      </div>
    </div>
  );
}

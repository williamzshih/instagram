import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserBlock from "@/components/UserBlock";

type Props = {
  comment: string;
  createdAt: Date;
  onClick?: () => void;
  size: number;
  user: Pick<User, "image" | "name" | "username">;
};

export default function Comment({
  comment,
  createdAt,
  onClick,
  size,
  user,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {onClick ? (
        <div className="flex items-center justify-between">
          <UserBlock size={size} user={user} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <Button
                className="w-full cursor-pointer text-red-500 hover:text-red-500"
                onClick={onClick}
                variant="outline"
              >
                Delete
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <UserBlock link size={size} user={user} />
      )}
      {comment && <p className="bg-muted rounded-xl p-4">{comment}</p>}
      <div className="text-muted-foreground text-right text-sm">
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
        })}
      </div>
    </div>
  );
}

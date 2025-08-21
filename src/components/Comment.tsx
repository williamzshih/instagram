import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical } from "lucide-react";
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
  user: {
    image: null | string;
    name: null | string;
    username: string;
  };
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
              <Button className="[&_svg]:size-4 px-2 py-4" variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <Button
                className="cursor-pointer text-red-500 w-full"
                onClick={onClick}
                variant="secondary"
              >
                Delete
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <UserBlock size={size} user={user} />
      )}
      {comment && <p className="bg-muted p-4 rounded-xl">{comment}</p>}
      <div className="text-sm text-muted-foreground text-right">
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
        })}
      </div>
    </div>
  );
}

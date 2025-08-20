import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserBlock from "@/components/UserBlock";

type Props = {
  comment: string;
  createdAt: Date;
  onDelete: () => void;
  size: number;
  user: {
    avatar: string;
    name: string;
    username: string;
  };
};

export default function DeletableComment({
  comment,
  createdAt,
  onDelete,
  size,
  user,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <UserBlock profile={user} size={size} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="[&_svg]:size-4 px-2 py-4" variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {comment && <p className="bg-muted p-2 rounded-lg">{comment}</p>}
      <div className="text-sm text-muted-foreground text-right">
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
        })}
      </div>
    </div>
  );
}

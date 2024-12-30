import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { User as UserType } from "@prisma/client";
import UserHeader from "@/components/UserHeader";

export default function DeletableComment({
  user,
  comment,
  createdAt,
  size,
  onDelete,
}: {
  user: UserType;
  comment: string;
  createdAt: Date;
  size: number;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <UserHeader user={user} size={size} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="[&_svg]:size-4 h-0 w-0 px-2 py-4"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
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

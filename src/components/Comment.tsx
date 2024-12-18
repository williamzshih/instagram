import { Comment as CommentType, User as UserType } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function Comment({
  comment,
}: {
  comment: CommentType & { user: UserType };
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="w-12 h-12 rounded-full">
          <AvatarImage
            src={comment.user.avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        </Avatar>
        <div className="flex flex-col items-center justify-center">
          {comment.user.name}
          <p className="text-sm text-gray-500">@{comment.user.username}</p>
        </div>
      </div>
      <p className="bg-gray-100 p-2 rounded-lg">{comment.comment}</p>
      <div className="text-sm text-gray-500 text-right">
        {comment.createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}

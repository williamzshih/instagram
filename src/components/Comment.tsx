import { Comment as CommentType } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getUser } from "@/utils/actions";

export default async function Comment({ comment }: { comment: CommentType }) {
  const user = await getUser(comment.email);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="w-12 h-12 rounded-full">
          <AvatarImage
            src={
              user?.avatar ??
              "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
            }
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        </Avatar>
        <div className="flex flex-col items-center justify-center">
          {user?.name ?? ""}
          <p className="text-sm text-gray-500">@{user?.username ?? ""}</p>
        </div>
      </div>
      <p className="bg-gray-100 p-2 rounded-lg mb-4">{comment.comment}</p>
    </div>
  );
}

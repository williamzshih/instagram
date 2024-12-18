import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getPost, getUser } from "@/utils/actions";
import CommentForm from "@/components/CommentForm";

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const user = await getUser(post?.email ?? "");

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <img src={post?.image ?? ""} alt="Post" className="rounded-lg" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-16 h-16 rounded-full">
              <AvatarImage
                src={
                  user?.avatar ??
                  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                }
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            </Avatar>
            <div className="flex flex-col items-center justify-center">
              {user?.name ?? ""}
              <p className="text-sm text-gray-500">@{user?.username ?? ""}</p>
            </div>
          </div>
          <p className="bg-gray-100 p-2 rounded-lg mb-4">
            {post?.caption ?? ""}
          </p>
          <div className="w-full h-px bg-gray-200 mb-4"></div>
          <div className="flex justify-center gap-2">
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
            <CommentForm postId={post?.id ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}

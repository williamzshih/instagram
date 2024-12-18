import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getPost } from "@/utils/actions";
import CommentForm from "@/components/CommentForm";
import Comment from "@/components/Comment";

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <img src={post?.image || ""} alt="Post" className="rounded-lg" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-16 h-16 rounded-full">
              <AvatarImage
                src={
                  post?.user?.avatar ||
                  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                }
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            </Avatar>
            <div className="flex flex-col items-center justify-center">
              {post?.user?.name || ""}
              <p className="text-sm text-gray-500">
                @{post?.user?.username || ""}
              </p>
            </div>
          </div>
          <p className="bg-gray-100 p-2 rounded-lg">{post?.caption || ""}</p>
          <div className="text-sm text-gray-500 text-right mb-4">
            {post?.createdAt.toLocaleDateString() || ""}
          </div>
          <div className="w-full h-px bg-gray-200 mb-4"></div>
          {post?.comments.map((comment) => (
            <Comment comment={comment} />
          ))}
          <div className="flex justify-center gap-2">
            <Avatar className="w-12 h-12 rounded-full">
              <AvatarImage
                src={
                  post?.user?.avatar ||
                  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                }
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            </Avatar>
            <CommentForm postId={params.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

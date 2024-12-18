import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getPost, getUser } from "@/utils/actions";

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
          <p className="bg-gray-100 p-2 rounded-lg">{post?.caption ?? ""}</p>
        </div>
      </div>
    </div>
  );
}
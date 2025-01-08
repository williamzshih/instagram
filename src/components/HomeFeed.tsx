import { Plus } from "lucide-react";
import GradientAvatar from "@/components/GradientAvatar";
import Post from "@/components/Post";

export default function HomeFeed({
  user,
}: {
  user: {
    following: {
      id: string;
      following: {
        username: string;
        avatar: string;
        posts: {
          id: string;
        }[];
      };
    }[];
    id: string;
    avatar: string;
    username: string;
    name: string;
  };
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-full border flex items-center justify-center">
          <Plus size={20} />
        </div>
        {user.following.map((follow) => (
          <div
            key={follow.id}
            className="flex flex-col items-center justify-center gap-1"
          >
            <GradientAvatar user={follow.following} size={16} />
            <p className="text-[12px] text-muted-foreground">
              @{follow.following.username}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {user.following
          .flatMap((follow) => follow.following.posts)
          .map((post) => (
            <Post
              key={post.id}
              id={post.id}
              searchParams={{ from: "homeFeed" }}
              user={user}
            />
          ))}
      </div>
    </div>
  );
}

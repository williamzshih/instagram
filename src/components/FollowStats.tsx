import { X } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deleteFollow } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserBlock from "@/components/UserBlock";

type Props = {
  user: Pick<User, "followers" | "following">;
} & (
  | {
      followers: number;
      type: "user";
    }
  | {
      type: "profile";
    }
);

export default function FollowStats(props: Props) {
  const { type, user } = props;

  const [followers, setFollowers] = useState(user.followers);
  const [following, setFollowing] = useState(user.following);

  const deleteFollower = (id: string) => {
    setFollowers((prev) => prev.filter((f) => f.id !== id));
  };

  const deleteFollowee = (id: string) => {
    setFollowing((prev) => prev.filter((f) => f.id !== id));
  };

  const handleRemoveFollower = async (id: string) => {
    try {
      deleteFollower(id);
      await deleteFollow(id);
      toast.success("Removed follower");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleUnfollow = async (id: string) => {
    try {
      deleteFollowee(id);
      await deleteFollow(id);
      toast.success("Unfollowed user");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="size-fit cursor-pointer flex-col gap-0"
            variant="ghost"
          >
            <p className="text-lg">
              {type === "profile" ? followers.length : props.followers}
            </p>
            Follower
            {type === "profile"
              ? followers.length === 1 && "s"
              : props.followers === 1 && "s"}
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="text-xl">Followers</DialogTitle>
          <ScrollArea className="pr-4 sm:max-h-[85vh]">
            <div className="flex flex-col gap-4">
              {followers.length > 0 ? (
                followers.map((follow) => (
                  <div className="relative" key={follow.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="bg-muted rounded-xl p-4 transition-all hover:brightness-95">
                          <Link href={`/user/${follow.follower.username}`}>
                            <UserBlock size={12} user={follow.follower} />
                          </Link>
                        </div>
                      </HoverCardTrigger>
                      {type === "profile" && (
                        <HoverCardContent className="w-fit">
                          Followed you on{" "}
                          {new Date(follow.createdAt).toLocaleDateString()}
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    {type === "profile" && (
                      <Button
                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-red-500 hover:text-red-500"
                        onClick={() => handleRemoveFollower(follow.id)}
                        variant="outline"
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No followers yet</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="size-fit cursor-pointer flex-col gap-0"
            variant="ghost"
          >
            <p className="text-lg">{following.length}</p>
            Following
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="text-xl">Following</DialogTitle>
          <ScrollArea className="pr-4 sm:max-h-[85vh]">
            <div className="flex flex-col gap-4">
              {following.length > 0 ? (
                following.map((follow) => (
                  <div className="relative" key={follow.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="bg-muted rounded-xl p-4 transition-all hover:brightness-95">
                          <Link href={`/user/${follow.followee.username}`}>
                            <UserBlock size={12} user={follow.followee} />
                          </Link>
                        </div>
                      </HoverCardTrigger>
                      {type === "profile" && (
                        <HoverCardContent className="w-fit">
                          Followed you on{" "}
                          {new Date(follow.createdAt).toLocaleDateString()}
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    {type === "profile" && (
                      <Button
                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-red-500 hover:text-red-500"
                        onClick={() => handleUnfollow(follow.id)}
                        variant="outline"
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  Not following anyone yet
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

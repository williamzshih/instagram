import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  deleteFollow,
  getFollowers,
  getFollowing,
  toggleFollow,
} from "@/actions/user";
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
import { Skeleton } from "@/components/ui/skeleton";
import UserBlock from "@/components/UserBlock";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";

type Props = {
  userId: string;
} & (
  | {
      currentUserId: string;
      initialFollow: boolean;
      type: "user";
    }
  | {
      type: "profile";
    }
);

export default function FollowStats(props: Props) {
  const { type, userId } = props;
  const queryClient = useQueryClient();

  const {
    data: followers,
    error: followersError,
    isPending: gettingFollowers,
  } = useQuery({
    queryFn: () => getFollowers(userId),
    queryKey: ["followStats", "followers", userId],
  });

  const {
    data: following,
    error: followingError,
    isPending: gettingFollowing,
  } = useQuery({
    queryFn: () => getFollowing(userId),
    queryKey: ["followStats", "following", userId],
  });

  const {
    isPending: deletingFollow,
    mutate,
    variables,
  } = useMutation({
    mutationFn: ({ id, type }: { id: string; type: "remove" | "unfollow" }) => {
      deleteFollow(id);
      return Promise.resolve(type);
    },
    onError: (error) => toast.error(error.message),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["followStats"] }),
    onSuccess: (type) =>
      toast.success(type === "remove" ? "Removed follower" : "Unfollowed user"),
  });

  const [followed, setFollowed] = useState(
    type === "user" ? props.initialFollow : false
  );

  const base = useMemo(() => followers?.length || 0, [followers]);

  const [toggledFollowers, toggleToggledFollowers] = useToggle(
    base,
    base + (type === "user" ? (props.initialFollow ? -1 : 1) : 0)
  );

  if (followersError) {
    console.error("Error getting followers:", followersError);
    throw new Error("Error getting followers:", { cause: followersError });
  }
  if (followingError) {
    console.error("Error getting following:", followingError);
    throw new Error("Error getting following:", { cause: followingError });
  }

  const handleFollow = async () => {
    try {
      if (type !== "user") return;
      setFollowed(!followed);
      toggleToggledFollowers();
      await toggleFollow({
        followed,
        followeeId: userId,
        followerId: props.currentUserId,
      });
      toast.success(followed ? "Unfollowed user" : "Followed user");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="size-fit cursor-pointer flex-col gap-0"
              variant="ghost"
            >
              {gettingFollowers ? (
                <Skeleton className="h-12 w-16 rounded-md" />
              ) : (
                <>
                  <p className="text-lg">
                    {type === "profile" ? followers.length : toggledFollowers}
                  </p>
                  Follower
                  {type === "profile"
                    ? followers.length !== 1 && "s"
                    : toggledFollowers !== 1 && "s"}
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle className="text-xl">Followers</DialogTitle>
            <ScrollArea className="pr-4 sm:max-h-[85vh]">
              <div className="flex flex-col gap-4">
                {gettingFollowers ? (
                  <div className="flex justify-center pl-4">
                    <LoaderCircle className="animate-spin" size={48} />
                  </div>
                ) : followers.length > 0 ? (
                  followers.map((follow) => (
                    <div
                      className={cn(
                        "relative",
                        deletingFollow &&
                          variables.id === follow.id &&
                          "opacity-50"
                      )}
                      key={follow.id}
                    >
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
                          onClick={() =>
                            mutate({ id: follow.id, type: "remove" })
                          }
                          variant="outline"
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground flex justify-center">
                    No followers yet
                  </p>
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
              {gettingFollowing ? (
                <Skeleton className="h-12 w-16 rounded-md" />
              ) : (
                <>
                  <p className="text-lg">{following.length}</p>
                  Following
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle className="text-xl">Following</DialogTitle>
            <ScrollArea className="pr-4 sm:max-h-[85vh]">
              <div className="flex flex-col gap-4">
                {gettingFollowing ? (
                  <div className="flex justify-center pl-4">
                    <LoaderCircle className="animate-spin" size={48} />
                  </div>
                ) : following.length > 0 ? (
                  following.map((follow) => (
                    <div
                      className={cn(
                        "relative",
                        deletingFollow &&
                          variables.id === follow.id &&
                          "opacity-50"
                      )}
                      key={follow.id}
                    >
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
                            You followed on{" "}
                            {new Date(follow.createdAt).toLocaleDateString()}
                          </HoverCardContent>
                        )}
                      </HoverCard>
                      {type === "profile" && (
                        <Button
                          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-red-500 hover:text-red-500"
                          onClick={() =>
                            mutate({ id: follow.id, type: "unfollow" })
                          }
                          variant="outline"
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground flex justify-center">
                    Not following anyone yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      {type === "user" &&
        (followers ? (
          followed ? (
            <Button
              className="from-ig-orange to-ig-red cursor-pointer bg-linear-to-tr"
              onClick={handleFollow}
              onMouseEnter={(e) => (e.currentTarget.textContent = "Unfollow")}
              onMouseLeave={(e) => (e.currentTarget.textContent = "Following")}
            >
              Following
            </Button>
          ) : (
            <Button className="cursor-pointer" onClick={handleFollow}>
              Follow
            </Button>
          )
        ) : (
          <Skeleton className="h-9 w-20 rounded-md" />
        ))}
    </>
  );
}

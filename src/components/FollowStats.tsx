import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import {
  getFollowers,
  getFollowing,
  removeFollow,
  toggleFollow,
} from "@/actions/profile";
import Loading from "@/components/Loading";
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
import useToggle from "@/hooks/useToggle";

type Props = {
  currentUser?: boolean;
  following?: boolean;
  profile: {
    _count: {
      followers: number;
      following: number;
    };
    id: string;
  };
};

export default function FollowStats({
  currentUser,
  following: initialFollowing = false,
  profile,
}: Props) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [toggledFollowers, setToggledFollowers] = useToggle(
    profile._count.followers,
    profile._count.followers + (initialFollowing ? -1 : 1),
    profile._count.followers
  );
  const [numFollowers, setNumFollowers] = useState(profile._count.followers);
  const [numFollowing, setNumFollowing] = useState(profile._count.following);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const {
    data: followers,
    error: followersError,
    isPending: followersPending,
  } = useQuery({
    enabled: followersOpen,
    queryFn: () => getFollowers(profile.id),
    queryKey: ["followers", profile.id],
  });

  const {
    data: following,
    error: followingError,
    isPending: followingPending,
  } = useQuery({
    enabled: followingOpen,
    queryFn: () => getFollowing(profile.id),
    queryKey: ["following", profile.id],
  });

  if (followersError) {
    console.error("Error getting followers:", followersError);
    throw new Error("Error getting followers:", { cause: followersError });
  }
  if (followingError) {
    console.error("Error getting followed users:", followingError);
    throw new Error("Error getting followed users:", { cause: followingError });
  }

  const queryClient = useQueryClient();

  const { mutate: remove } = useMutation({
    mutationFn: (followerId: string) =>
      removeFollow(followerId, profile.id, "remove"),
    onError: (_, __, context: undefined | { previousFollowers: unknown }) =>
      queryClient.setQueryData(
        ["followers", profile.id],
        context?.previousFollowers
      ),
    onMutate: async (followerId) => {
      setNumFollowers(numFollowers - 1);
      await queryClient.cancelQueries({
        queryKey: ["followers", profile.id],
      });
      const previousFollowers = queryClient.getQueryData([
        "followers",
        profile.id,
      ]);
      queryClient.setQueryData(
        ["followers", profile.id],
        (
          old: {
            avatar: string;
            createdAt: Date;
            id: string;
            name: string;
            username: string;
          }[]
        ) => old.filter((follower) => follower.id !== followerId)
      );
      return { previousFollowers };
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["followers", profile.id],
      }),
  });

  const { mutate: unfollow } = useMutation({
    mutationFn: (followeeId: string) =>
      removeFollow(profile.id, followeeId, "unfollow"),
    onError: (_, __, context: undefined | { previousFollowing: unknown }) =>
      queryClient.setQueryData(
        ["following", profile.id],
        context?.previousFollowing
      ),
    onMutate: async (followeeId) => {
      setNumFollowing(numFollowing - 1);
      await queryClient.cancelQueries({
        queryKey: ["following", profile.id],
      });
      const previousFollowing = queryClient.getQueryData([
        "following",
        profile.id,
      ]);
      queryClient.setQueryData(
        ["following", profile.id],
        (
          old: {
            avatar: string;
            createdAt: Date;
            id: string;
            name: string;
            username: string;
          }[]
        ) => old.filter((followee) => followee.id !== followeeId)
      );
      return { previousFollowing };
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["following", profile.id],
      }),
  });

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setToggledFollowers();
    toggleFollow(profile.id, isFollowing);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-2">
        <Dialog onOpenChange={setFollowersOpen} open={followersOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-fit flex flex-col items-center justify-center gap-0 cursor-pointer"
              variant="ghost"
            >
              <p className="text-lg font-bold">
                {currentUser ? numFollowers : toggledFollowers}
              </p>
              <p>
                {currentUser
                  ? numFollowers === 1
                    ? "Follower"
                    : "Followers"
                  : toggledFollowers === 1
                    ? "Follower"
                    : "Followers"}
              </p>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-4">
            <DialogTitle className="text-xl">Followers</DialogTitle>
            <ScrollArea className="h-[80vh] px-3">
              <div className="flex flex-col gap-2">
                {followersPending ? (
                  <Loading />
                ) : followers.length > 0 ? (
                  followers.map((follower) => (
                    <div
                      className="bg-muted rounded-lg p-4 hover:bg-muted-foreground/25 transition-colors"
                      key={follower.id}
                    >
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center justify-center">
                            <Link
                              className="flex-1"
                              href={`/user/${follower.username}`}
                            >
                              <UserBlock noLink profile={follower} size={16} />
                            </Link>
                            {currentUser && (
                              <Button
                                className="cursor-pointer"
                                onClick={() => remove(follower.id)}
                                size="sm"
                                variant="destructive"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </HoverCardTrigger>
                        {currentUser && (
                          <HoverCardContent className="text-center w-auto">
                            Followed you on{" "}
                            {follower.createdAt.toLocaleDateString()}
                          </HoverCardContent>
                        )}
                      </HoverCard>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No followers yet</p>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Dialog onOpenChange={setFollowingOpen} open={followingOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-fit flex flex-col items-center justify-center gap-0 cursor-pointer"
              variant="ghost"
            >
              <p className="text-lg font-bold">{numFollowing}</p>
              <p>Following</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-4">
            <DialogTitle className="text-xl">Following</DialogTitle>
            <ScrollArea className="h-[80vh] px-3">
              <div className="flex flex-col gap-2">
                {followingPending ? (
                  <Loading />
                ) : following.length > 0 ? (
                  following.map((followee) => (
                    <div
                      className="bg-muted rounded-lg p-4 hover:bg-muted-foreground/25 transition-colors"
                      key={followee.id}
                    >
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center justify-center">
                            <Link
                              className="flex-1"
                              href={`/user/${followee.username}`}
                            >
                              <UserBlock noLink profile={followee} size={16} />
                            </Link>
                            {currentUser && (
                              <Button
                                className="cursor-pointer"
                                onClick={() => unfollow(followee.id)}
                                size="sm"
                                variant="destructive"
                              >
                                Unfollow
                              </Button>
                            )}
                          </div>
                        </HoverCardTrigger>
                        {currentUser && (
                          <HoverCardContent className="text-center w-auto">
                            Followed you on{" "}
                            {followee.createdAt.toLocaleDateString()}
                          </HoverCardContent>
                        )}
                      </HoverCard>
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
      {!currentUser &&
        (isFollowing ? (
          <Button
            className="bg-linear-to-tr from-ig-orange to-ig-red cursor-pointer"
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
        ))}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserBlock from "@/components/UserBlock";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  getFollowers,
  getFollowing,
  removeFollow,
  type Follower,
  type Following,
} from "@/actions/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Loading from "@/components/Loading";
import { type ProfilePageProps } from "@/components/ProfilePage";

export default function FollowStats({
  profile,
  isCurrentUser,
}: ProfilePageProps) {
  const [followingOpen, setFollowingOpen] = useState(false);

  const {
    data: followers = { followers: [], length: 0 },
    isLoading: isLoadingFollowers,
  } = useQuery({
    queryKey: ["followers", profile.username],
    queryFn: () => getFollowers(profile.username),
  });

  const { data: following = [], isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["following", profile.username],
    queryFn: () => getFollowing(profile.username),
    enabled: followingOpen,
  });

  const queryClient = useQueryClient();

  const { mutate: remove } = useMutation({
    mutationFn: (followerId: string) =>
      removeFollow(followerId, profile.id, "remove"),
    onMutate: async (followerId) => {
      await queryClient.cancelQueries({
        queryKey: ["followers", profile.username],
      });
      const previousFollowers = queryClient.getQueryData([
        "followers",
        profile.username,
      ]);
      queryClient.setQueryData(
        ["followers", profile.username],
        (old: Follower[]) =>
          old.filter((follower) => follower.id !== followerId)
      );
      return { previousFollowers };
    },
    onError: (_, __, context) =>
      queryClient.setQueryData(
        ["followers", profile.username],
        context?.previousFollowers
      ),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["followers", profile.username],
      }),
  });

  const { mutate: unfollow } = useMutation({
    mutationFn: (followeeId: string) =>
      removeFollow(profile.id, followeeId, "unfollow"),
    onMutate: async (followeeId) => {
      await queryClient.cancelQueries({
        queryKey: ["following", profile.username],
      });
      const previousFollowing = queryClient.getQueryData([
        "following",
        profile.username,
      ]);
      queryClient.setQueryData(
        ["following", profile.username],
        (old: Following[]) =>
          old.filter((following) => following.id !== followeeId)
      );
      return { previousFollowing };
    },
    onError: (_, __, context) =>
      queryClient.setQueryData(
        ["following", profile.username],
        context?.previousFollowing
      ),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["following", profile.username],
      }),
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-fit flex flex-col items-center justify-center gap-0 cursor-pointer"
          >
            <p className="text-lg font-bold">
              {followers.length || profile._count.followers}
            </p>
            <p>
              {followers.length === 1 || profile._count.followers === 1
                ? "Follower"
                : "Followers"}
            </p>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogTitle className="text-xl">Followers</DialogTitle>
          <ScrollArea className="h-[80vh] px-3">
            <div className="flex flex-col gap-2">
              {isLoadingFollowers ? (
                <Loading />
              ) : followers.followers.length > 0 ? (
                followers.followers.map((follower) => (
                  <div
                    key={follower.username}
                    className="bg-muted rounded-lg p-4 hover:bg-muted-foreground/25 transition-colors"
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center justify-center">
                          <Link
                            href={`/user/${follower.username}`}
                            className="flex-1"
                          >
                            <UserBlock user={follower} size={16} />
                            {/* TODO: <a> hydration error */}
                          </Link>
                          {isCurrentUser && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => remove(follower.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </HoverCardTrigger>
                      {isCurrentUser && (
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
      <Dialog open={followingOpen} onOpenChange={setFollowingOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-fit flex flex-col items-center justify-center gap-0 cursor-pointer"
          >
            <p className="text-lg font-bold">
              {following.length || profile._count.following}
            </p>
            <p>Following</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogTitle className="text-xl">Following</DialogTitle>
          <ScrollArea className="h-[80vh] px-3">
            <div className="flex flex-col gap-2">
              {isLoadingFollowing ? (
                <Loading />
              ) : following.length > 0 ? (
                following.map((followee) => (
                  <div
                    key={followee.username}
                    className="bg-muted rounded-lg p-4 hover:bg-muted-foreground/25 transition-colors"
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center justify-center">
                          <Link
                            href={`/user/${followee.username}`}
                            className="flex-1"
                          >
                            <UserBlock user={followee} size={16} />
                            {/* TODO: <a> hydration error */}
                          </Link>
                          {isCurrentUser && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => unfollow(followee.id)}
                            >
                              Unfollow
                            </Button>
                          )}
                        </div>
                      </HoverCardTrigger>
                      {isCurrentUser && (
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
  );
}

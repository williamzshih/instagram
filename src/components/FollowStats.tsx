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
  type Profile,
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

export default function FollowStats({ profile }: { profile: Profile }) {
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const { data: followers = [], isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followers", profile.username],
    queryFn: () => getFollowers(profile.username),
    enabled: followersOpen,
  });

  const { data: following = [], isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["following", profile.username],
    queryFn: () => getFollowing(profile.username),
    enabled: followingOpen,
  });

  const queryClient = useQueryClient();

  const { mutate: remove } = useMutation({
    mutationFn: (otherEmail: string) =>
      removeFollow(otherEmail, profile.username, "remove"),
    onMutate: async (otherEmail) => {
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
          old.filter((follower) => follower.email !== otherEmail)
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
    mutationFn: (otherUsername: string) =>
      removeFollow(profile.email, otherUsername, "unfollow"),
    onMutate: async (otherUsername) => {
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
          old.filter((following) => following.username !== otherUsername)
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
      <Dialog open={followersOpen} onOpenChange={setFollowersOpen}>
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
              ) : followers.length > 0 ? (
                followers.map((follower) => (
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
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => remove(follower.email)}
                          >
                            Remove
                          </Button>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="text-center w-auto">
                        Followed you on{" "}
                        {follower.createdAt.toLocaleDateString()}
                      </HoverCardContent>
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
                following.map((following) => (
                  <div
                    key={following.username}
                    className="bg-muted rounded-lg p-4 hover:bg-muted-foreground/25 transition-colors"
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center justify-center">
                          <Link
                            href={`/user/${following.username}`}
                            className="flex-1"
                          >
                            <UserBlock user={following} size={16} />
                            {/* TODO: <a> hydration error */}
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => unfollow(following.username)}
                          >
                            Unfollow
                          </Button>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="text-center w-auto">
                        You followed on{" "}
                        {following.createdAt.toLocaleDateString()}
                      </HoverCardContent>
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

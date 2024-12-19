"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getLike, getPost, updateLike } from "@/utils/actions";
import CommentForm from "@/components/CommentForm";
import Comment from "@/components/Comment";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Like as LikeType,
  Post as PostType,
  User as UserType,
  Comment as CommentType,
} from "@prisma/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
export default function Post({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    isPending: isPostPending,
    isError: isPostError,
    data: post,
    error: postError,
  } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => getPost(params.id),
  });

  const {
    isPending: isLikePending,
    isError: isLikeError,
    data: like,
    error: likeError,
  } = useQuery({
    queryKey: ["like", params.id],
    queryFn: () => getLike(params.id),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ like }: { like: LikeType | null }) =>
      updateLike(like, params.id),
    onMutate: async ({ like }) => {
      await queryClient.cancelQueries({ queryKey: ["post", params.id] });
      await queryClient.cancelQueries({ queryKey: ["like", params.id] });

      const previousPost = queryClient.getQueryData(["post", params.id]);
      const previousLike = queryClient.getQueryData(["like", params.id]);

      queryClient.setQueryData(
        ["post", params.id],
        (
          old: PostType & {
            user: UserType;
            comments: (CommentType & { user: UserType })[];
            likes: LikeType[];
          }
        ) => ({
          ...old,
          likes: like
            ? old.likes.filter((l) => l.id !== like.id)
            : [...old.likes, { id: "temp" }],
        })
      );

      queryClient.setQueryData(["like", params.id], () =>
        like ? null : { id: "temp" }
      );

      return { previousPost, previousLike };
    },
    onError: (err, _, context) => {
      console.log("Error updating like:", err);
      toast.error("Error updating like");

      queryClient.setQueryData(["post", params.id], context?.previousPost);
      queryClient.setQueryData(["like", params.id], context?.previousLike);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", params.id] });
      queryClient.invalidateQueries({ queryKey: ["like", params.id] });
    },
  });

  if (isPostPending || isLikePending) {
    return (
      <Dialog defaultOpen onOpenChange={() => router.back()}>
        <DialogContent className="sm:max-w-[95vw] h-[95vh]">
          <div className="flex flex-col items-center p-4">
            <div className="grid md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col">
                <Skeleton className="w-full h-96 rounded-lg mb-2" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center gap-1">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-[19px] w-20" />
                  </div>
                </div>
                <Skeleton className="h-10 rounded-lg mb-1" />
                <Skeleton className="w-24 h-5 self-end mb-3" />
                <Skeleton className="w-full h-px mb-4" />
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2 mb-4">
                      <Skeleton className="w-12 h-10 rounded-full" />
                      <Skeleton className="w-full h-6" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isPostError || isLikeError) {
    if (postError) {
      console.error("Error fetching post:", postError);
      toast.error("Error fetching post");
    }
    if (likeError) {
      console.error("Error fetching like:", likeError);
      toast.error("Error fetching like");
    }
    return (
      <Dialog defaultOpen onOpenChange={() => router.back()}>
        <DialogContent className="sm:max-w-[95vw] h-[95vh]">
          <div className="flex flex-col items-center justify-center p-4 text-red-500">
            {postError && <p>Error fetching post: {postError.message}</p>}
            {likeError && <p>Error fetching like: {likeError.message}</p>}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[95vw] h-[95vh] overflow-scroll">
        <div className="flex flex-col items-center p-4">
          <div className="grid md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col">
              <img
                src={post.image}
                alt="Post image"
                className="rounded-lg object-cover mb-2"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => mutate({ like })}
                  >
                    <Heart
                      size={32}
                      absoluteStrokeWidth
                      stroke={like ? "red" : "black"}
                      fill={like ? "red" : "white"}
                    />
                  </Button>
                  <p>{post.likes.length}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark size={32} absoluteStrokeWidth />
                </Button>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="w-16 h-16 rounded-full">
                  <AvatarImage
                    src={post.user.avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </Avatar>
                <div className="flex flex-col items-center justify-center">
                  <p>{post.user.name}</p>
                  <p className="text-sm text-gray-500">@{post.user.username}</p>
                </div>
              </div>
              <p className="bg-gray-100 p-2 rounded-lg">{post.caption}</p>
              <div className="text-sm text-gray-500 text-right mb-4">
                {post.createdAt.toLocaleDateString()}
              </div>
              <div className="w-full h-px bg-gray-200 mb-4"></div>
              {post.comments.map((comment) => (
                <Comment comment={comment} key={comment.id} />
              ))}
              <div className="flex justify-center gap-2">
                <Avatar className="w-12 h-12 rounded-full">
                  <AvatarImage
                    src={post.user.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Avatar>
                <CommentForm postId={params.id} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

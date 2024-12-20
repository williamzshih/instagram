"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  getLike,
  getPost,
  updateLike,
  createComment,
  getUser,
} from "@/utils/actions";
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
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

const COMMENT_MAX = 1000;

export default function Post({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const {
    data: post,
    isPending: isGetPostPending,
    isError: isGetPostError,
    error: getPostError,
  } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => getPost(params.id),
  });

  const {
    data: like,
    isPending: isGetLikePending,
    isError: isGetLikeError,
    error: getLikeError,
  } = useQuery({
    queryKey: ["like", params.id],
    queryFn: () => getLike(params.id),
  });

  const {
    data: user,
    isPending: isGetUserPending,
    isError: isGetUserError,
    error: getUserError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { mutate: updateLikeMutate } = useMutation({
    mutationFn: (like: LikeType | null) => updateLike(like, params.id),
    onMutate: async (like) => {
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
            : [...old.likes, {}],
        })
      );

      queryClient.setQueryData(["like", params.id], () => (like ? null : {}));

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

  const { mutate: createCommentMutate } = useMutation({
    mutationFn: (comment: string) => createComment(params.id, comment),
    onMutate: async (comment) => {
      await queryClient.cancelQueries({ queryKey: ["post", params.id] });

      const previousPost = queryClient.getQueryData(["post", params.id]);

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
          comments: [
            ...old.comments,
            {
              comment: comment,
              createdAt: new Date(),
              user: {
                avatar: user?.avatar || "",
                username: user?.username || "",
                name: user?.name || "",
              },
            },
          ],
        })
      );

      return { previousPost };
    },
    onError: (err, _, context) => {
      console.log("Error creating comment:", err);
      toast.error("Error creating comment");

      queryClient.setQueryData(["post", params.id], context?.previousPost);
    },
    onSuccess: () => toast.success("Comment created"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", params.id] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  if (isGetPostPending || isGetLikePending || isGetUserPending) {
    return (
      <div className="overflow-y-scroll">
        <div className="flex flex-col items-center justify-center p-4">
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
      </div>
    );
  }

  if (isGetPostError || isGetLikeError || isGetUserError) {
    if (isGetPostError) {
      console.error("Error fetching post:", getPostError);
      toast.error("Error fetching post");
    }
    if (isGetLikeError) {
      console.error("Error fetching like:", getLikeError);
      toast.error("Error fetching like");
    }
    if (isGetUserError) {
      console.error("Error fetching user:", getUserError);
      toast.error("Error fetching user");
    }
    return (
      <div className="overflow-y-scroll">
        <div className="flex flex-col items-center justify-center p-4 text-red-500">
          {isGetPostError && <p>Error fetching post: {getPostError.message}</p>}
          {isGetLikeError && <p>Error fetching like: {getLikeError.message}</p>}
          {isGetUserError && <p>Error fetching user: {getUserError.message}</p>}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="overflow-y-scroll">
      <div className="flex flex-col items-center justify-center p-4">
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
                  onClick={() => updateLikeMutate(like)}
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
            <div className="flex justify-center gap-2 mt-4">
              <Avatar className="w-12 h-12 rounded-full">
                <AvatarImage
                  src={user.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </Avatar>
              <form
                className="flex flex-col gap-2 w-full"
                onSubmit={handleSubmit(({ comment }) => {
                  reset();
                  createCommentMutate(comment);
                })}
              >
                <div className="flex flex-col">
                  <Textarea
                    {...register("comment", {
                      required: "Comment is required",
                      maxLength: {
                        value: COMMENT_MAX,
                        message: `Comment must be at most ${COMMENT_MAX} characters long`,
                      },
                    })}
                    placeholder="Comment"
                    className={`h-24 ${errors.comment ? "border-red-500" : ""}`}
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.comment.message || "An error occurred"}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button className="mt-4 w-fit" type="submit">
                    Post comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getPost, toggleLike, createComment, getUser } from "@/utils/actions";
import Comment from "@/components/Comment";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Like as LikeType,
  Post as PostType,
  User as UserType,
  Comment as CommentType,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const COMMENT_MAX = 1000;

export default function PostPage({
  params,
  fromHome = false,
}: {
  params: { id: string };
  fromHome?: boolean;
}) {
  const queryClient = useQueryClient();
  const [hideComments, setHideComments] = useState(fromHome);
  const router = useRouter();

  const {
    data: post,
    isPending: isPostPending,
    error: postError,
  } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => getPost(params.id),
  });

  const {
    data: user,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const { mutate: toggleLikeMutate } = useMutation({
    mutationFn: (like: LikeType | undefined) => toggleLike(like, params.id),
    onMutate: async (like) => {
      await queryClient.cancelQueries({ queryKey: ["post", params.id] });

      const previousPost = queryClient.getQueryData(["post", params.id]);

      queryClient.setQueryData(
        ["post", params.id],
        (
          old: PostType & {
            likes: (LikeType & { user: UserType })[];
          }
        ) => ({
          ...old,
          likes: like
            ? old.likes.filter((l) => l.id !== like.id)
            : [...old.likes, { user: { id: user?.id } }],
        })
      );

      return { previousPost };
    },
    onError: (error, _, context) => {
      console.error("Error toggling like:", error);
      toast.error("Error toggling like");

      queryClient.setQueryData(["post", params.id], context?.previousPost);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", params.id] });
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
    onError: (error, _, context) => {
      console.error("Error creating comment:", error);
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

  if (isPostPending || isUserPending) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  if (postError || userError) {
    if (postError) {
      console.error("Error fetching post:", postError);
      toast.error("Error fetching post");
    }
    if (userError) {
      console.error("Error fetching user:", userError);
      toast.error("Error fetching user");
    }
    return (
      <div className="flex flex-col items-center justify-center p-4 gap-4 text-red-500">
        {postError && <p>Error fetching post: {postError.message}</p>}
        {userError && <p>Error fetching user: {userError.message}</p>}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        User not found
      </div>
    );
  }

  const like = post.likes.find((l) => l.user.id === user.id);

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <Image
            src={post.image}
            alt="Post image"
            width={3840}
            height={3840}
            {...(fromHome
              ? {
                  className: "rounded-lg cursor-pointer",
                  onClick: () => router.push(`/post/${post.id}`),
                }
              : { className: "rounded-lg" })}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLikeMutate(like)}
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
        <div className="flex flex-col gap-4">
          <Comment
            user={post.user}
            comment={post.caption}
            createdAt={post.createdAt}
          />
          <Separator />
          <p className="text-sm text-gray-500">
            {post.comments.length}{" "}
            {post.comments.length === 1 ? "comment" : "comments"}
          </p>
          {hideComments
            ? null
            : post.comments.map((comment) => (
                <Comment
                  user={comment.user}
                  comment={comment.comment}
                  createdAt={comment.createdAt}
                  key={comment.id}
                />
              ))}
          {post.comments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-fit self-center"
              onClick={() => setHideComments(!hideComments)}
            >
              {hideComments ? "Show comments" : "Hide comments"}
            </Button>
          )}
          <div className="flex justify-center gap-2">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user.avatar}
                alt="User Avatar"
                className="object-cover"
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
                <Button type="submit">Post comment</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

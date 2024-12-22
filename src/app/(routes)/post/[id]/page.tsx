"use client";

import {
  getPost,
  toggleLike,
  createComment,
  getUser,
  toggleBookmark,
} from "@/utils/actions";
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
  Bookmark as BookmarkType,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";
import UserAvatar from "@/components/UserAvatar";

const COMMENT_MAX = 1000;

export default function PostPage({
  params,
  fromHome = false,
}: {
  params: { id: string };
  fromHome?: boolean;
}) {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(!fromHome);
  const router = useRouter();

  const {
    data: post,
    isPending: isPostPending,
    error: postError,
  } = useQuery({
    queryKey: ["post", "postPage", params.id],
    queryFn: () => getPost(params.id),
  });

  const {
    data: user,
    isPending: isUserPending,
    error: userError,
  } = useQuery({
    queryKey: ["user", "postPage"],
    queryFn: () => getUser(),
  });

  const { mutate: toggleLikeMutate } = useMutation({
    mutationFn: (like: LikeType | undefined) => toggleLike(like, params.id),
    onMutate: async (like) => {
      await queryClient.cancelQueries({
        queryKey: ["post", "postPage", params.id],
      });

      const previousPost = queryClient.getQueryData([
        "post",
        "postPage",
        params.id,
      ]);

      queryClient.setQueryData(
        ["post", "postPage", params.id],
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
      console.error(error);
      toast.error(error as unknown as string);

      queryClient.setQueryData(
        ["post", "postPage", params.id],
        context?.previousPost
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", "postPage", params.id],
      });
    },
  });

  const { mutate: toggleBookmarkMutate } = useMutation({
    mutationFn: (bookmark: BookmarkType | undefined) =>
      toggleBookmark(bookmark, params.id),
    onMutate: async (bookmark) => {
      await queryClient.cancelQueries({
        queryKey: ["post", "postPage", params.id],
      });
      await queryClient.cancelQueries({ queryKey: ["user", "profilePage"] });

      const previousPost = queryClient.getQueryData([
        "post",
        "postPage",
        params.id,
      ]);
      const previousUser = queryClient.getQueryData(["user", "profilePage"]);

      queryClient.setQueryData(
        ["post", "postPage", params.id],
        (
          old: PostType & {
            bookmarks: (BookmarkType & { user: UserType })[];
          }
        ) => ({
          ...old,
          bookmarks: bookmark
            ? old.bookmarks.filter((b) => b.id !== bookmark.id)
            : [...old.bookmarks, { user: { id: user?.id } }],
        })
      );

      if (previousUser) {
        queryClient.setQueryData(
          ["user", "profilePage"],
          (
            old: UserType & { bookmarks: (BookmarkType & { post: PostType })[] }
          ) => ({
            ...old,
            bookmarks: bookmark
              ? old.bookmarks.filter((b) => b.id !== bookmark.id)
              : [
                  ...old.bookmarks,
                  { post: { id: params.id, image: post?.image } },
                ],
          })
        );
      }

      return { previousPost, previousUser };
    },
    onError: (error, _, context) => {
      console.error(error);
      toast.error(error as unknown as string);

      queryClient.setQueryData(
        ["post", "postPage", params.id],
        context?.previousPost
      );
      queryClient.setQueryData(["user", "profilePage"], context?.previousUser);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", "postPage", params.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "profilePage"],
      });
    },
  });

  const { mutate: createCommentMutate } = useMutation({
    mutationFn: (comment: string) => createComment(params.id, comment),
    onMutate: async (comment) => {
      await queryClient.cancelQueries({
        queryKey: ["post", "postPage", params.id],
      });

      const previousPost = queryClient.getQueryData([
        "post",
        "postPage",
        params.id,
      ]);

      queryClient.setQueryData(
        ["post", "postPage", params.id],
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
      console.error(error);
      toast.error(error as unknown as string);

      queryClient.setQueryData(
        ["post", "postPage", params.id],
        context?.previousPost
      );
    },
    onSuccess: () => toast.success("Comment created"),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", "postPage", params.id],
      });
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
        <SyncLoader />
      </div>
    );
  }

  if (postError || userError) {
    if (postError) {
      console.error(postError);
      toast.error(postError as unknown as string);
    }
    if (userError) {
      console.error(userError);
      toast.error(userError as unknown as string);
    }
    return (
      <div className="flex flex-col items-center justify-center p-4 gap-4 text-red-500">
        {postError && <p>{postError as unknown as string}</p>}
        {userError && <p>{userError as unknown as string}</p>}
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
  const bookmark = post.bookmarks.find((b) => b.user.id === user.id);

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmarkMutate(bookmark)}
            >
              <Bookmark
                size={32}
                absoluteStrokeWidth
                fill={bookmark ? "black" : "white"}
              />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Comment
            user={post.user}
            comment={post.caption}
            createdAt={post.createdAt}
            size={16}
          />
          <Separator />
          <p className="text-sm text-gray-500">
            {post.comments.length}{" "}
            {post.comments.length === 1 ? "comment" : "comments"}
          </p>
          {showComments &&
            post.comments.map((comment) => (
              <Comment
                user={comment.user}
                comment={comment.comment}
                createdAt={comment.createdAt}
                size={12}
                key={comment.id}
              />
            ))}
          {post.comments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-fit self-center"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? "Hide comments" : "Show comments"}
            </Button>
          )}
          <div className="flex justify-center gap-2">
            <UserAvatar user={user} size={12} />
            <form
              className="flex flex-col gap-2 w-full"
              onSubmit={handleSubmit(({ comment }) => {
                reset();
                createCommentMutate(comment);
              })}
            >
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
                <p className="text-red-500 text-sm -mt-1">
                  {errors.comment.message || "An error occurred"}
                </p>
              )}
              <div className="w-fit self-end">
                <Button type="submit">Post comment</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createComment, deleteComment, getComments } from "@/actions/comment";
import { getImageHeight, getImageWidth } from "@/actions/image";
import { deletePost, getPost } from "@/actions/post";
import { toggleBookmark, toggleLike } from "@/actions/toggle";
import Comment from "@/components/Comment";
import DeletableComment from "@/components/DeletableComment";
import LinkAvatar from "@/components/LinkAvatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useToggle from "@/hooks/useToggle";
import { COMMENT_MAX } from "@/limits";
import Loading from "./Loading";

const formSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(COMMENT_MAX, {
      message: `Comment must be at most ${COMMENT_MAX} characters long`,
    }),
});

type Props = {
  bookmarked: boolean;
  fromHome?: boolean;
  liked: boolean;
  likes: number;
  postId: string;
  profile: {
    _count: {
      followers: number;
      following: number;
    };
    avatar: string;
    bio: string;
    createdAt: Date;
    id: string;
    name: string;
    username: string;
  };
};

export default function Post({
  bookmarked,
  fromHome,
  liked,
  likes,
  postId,
  profile,
}: Props) {
  const [commentsVisible, setCommentsVisible] = useState(!fromHome);
  const [isLiked, setIsLiked] = useState(liked);
  const [toggledLikes, setToggledLikes] = useToggle(
    likes,
    likes + (liked ? -1 : 1),
    likes
  );
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const {
    data: post,
    error: postError,
    isPending: postPending,
  } = useQuery({
    queryFn: () => getPost(postId),
    queryKey: ["post", postId],
  });

  const {
    data: comments,
    error: commentsError,
    isPending: commentsPending,
  } = useQuery({
    queryFn: () => getComments(postId),
    queryKey: ["comments", postId],
  });

  if (postError) {
    console.error("Error getting post:", postError);
    throw new Error("Error getting post:", { cause: postError });
  }
  if (commentsError) {
    console.error("Error getting comments:", commentsError);
    throw new Error("Error getting comments:", { cause: commentsError });
  }

  const { mutate: createCommentMutation } = useMutation({
    mutationFn: (comment: string) => createComment(postId, comment),
    onError: (_, __, context: undefined | { previousComments: unknown }) =>
      queryClient.setQueryData(["comments", postId], context?.previousComments),
    onMutate: async (comment) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });
      const previousComments = queryClient.getQueryData(["comments", postId]);
      queryClient.setQueryData(
        ["comments", postId],
        (old: Awaited<ReturnType<typeof getComments>>) => [
          ...old,
          {
            comment,
            createdAt: new Date(),
            id: crypto.randomUUID(),
            postId,
            user: profile,
          },
        ]
      );
      return { previousComments };
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onError: (_, __, context: undefined | { previousComments: unknown }) =>
      queryClient.setQueryData(["comments", postId], context?.previousComments),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });
      const previousComments = queryClient.getQueryData(["comments", postId]);
      queryClient.setQueryData(
        ["comments", postId],
        (old: Awaited<ReturnType<typeof getComments>>) =>
          old.filter((comment) => comment.id !== commentId)
      );
      return { previousComments };
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: () => deletePost(postId),
    onError: (_, __, context) =>
      queryClient.setQueryData(["post", postId], context?.previousPost),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["post", postId],
      });
      const previousPost = queryClient.getQueryData(["post", postId]);
      queryClient.setQueryData(["post", postId], null);
      return { previousPost };
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["post", postId] }),
  });

  const form = useForm({
    defaultValues: {
      comment: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    form.reset();
    createCommentMutation(data.comment);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setToggledLikes();
    toggleLike(postId, isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toggleBookmark(postId, isBookmarked);
  };

  useEffect(() => setMounted(true), []);

  if (!mounted) return;

  if (!post) return;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {postPending ? (
          <Loading />
        ) : fromHome ? (
          <Link href={`/post/${post.id}`}>
            <Image
              alt={post.caption || "Image of the post"}
              height={getImageHeight(post.image)}
              src={post.image}
              width={getImageWidth(post.image)}
            />
          </Link>
        ) : (
          <Image
            alt={post.caption || "Image of the post"}
            height={getImageHeight(post.image)}
            src={post.image}
            width={getImageWidth(post.image)}
          />
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button onClick={handleLike} size="icon" variant="ghost">
              <Heart
                fill={isLiked ? "red" : theme === "light" ? "white" : "black"}
                size={32}
                stroke={isLiked ? "red" : theme === "light" ? "black" : "white"}
              />
            </Button>
            <p>{toggledLikes}</p>
          </div>
          <Button onClick={handleBookmark} size="icon" variant="ghost">
            <Bookmark
              fill={
                isBookmarked
                  ? theme === "light"
                    ? "black"
                    : "white"
                  : theme === "light"
                    ? "white"
                    : "black"
              }
              size={32}
            />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {post.user.id === profile.id ? (
          <DeletableComment
            comment={post.caption}
            createdAt={post.createdAt}
            onDelete={() => deletePostMutation()}
            size={12}
            user={post.user}
          />
        ) : (
          <Comment
            comment={post.caption}
            createdAt={post.createdAt}
            size={12}
            user={post.user}
          />
        )}
        <Separator />
        {commentsVisible &&
          (commentsPending ? (
            <Loading />
          ) : (
            comments.map((comment) =>
              comment.user.id === profile.id ? (
                <DeletableComment
                  comment={comment.comment}
                  createdAt={comment.createdAt}
                  key={comment.id}
                  onDelete={() => deleteCommentMutation(comment.id)}
                  size={10}
                  user={comment.user}
                />
              ) : (
                <Comment
                  comment={comment.comment}
                  createdAt={comment.createdAt}
                  key={comment.id}
                  size={10}
                  user={comment.user}
                />
              )
            )
          ))}
        {commentsPending ? (
          <Loading />
        ) : (
          comments.length > 0 && (
            <Button
              className="self-center"
              onClick={() => setCommentsVisible(!commentsVisible)}
              size="sm"
              variant="ghost"
            >
              {commentsVisible
                ? `Hide ${comments.length} comment${
                    comments.length > 1 ? "s" : ""
                  }`
                : `Show ${comments.length} comment${
                    comments.length > 1 ? "s" : ""
                  }`}
            </Button>
          )
        )}
        <div className="flex gap-4">
          <LinkAvatar profile={profile} size={10} />
          <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Comment"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  getPost,
  toggleLike,
  createComment,
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import { COMMENT_MAX } from "@/limits";
import { useTheme } from "next-themes";
import {
  Form,
  FormMessage,
  FormControl,
  FormItem,
  FormField,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PostSkeleton from "@/components/PostSkeleton";

const formSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(COMMENT_MAX, {
      message: `Comment must be at most ${COMMENT_MAX} characters long`,
    }),
});

export default function Post({
  params,
  searchParams,
  user,
}: {
  params: { id: string };
  searchParams?: { from: string };
  user: UserType;
}) {
  const fromHomeFeed = searchParams?.from === "homeFeed";
  const [showComments, setShowComments] = useState(!fromHomeFeed);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: post,
    isPending,
    error,
  } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => getPost(params.id),
  });

  const { mutate: toggleLikeMutate } = useMutation({
    mutationFn: () => toggleLike(like, params.id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["post", params.id],
      });

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
            : [...old.likes, { user: { id: user.id } }],
        })
      );

      return { previousPost };
    },
    onError: (error, _, context) => {
      toast.error(error.message);
      queryClient.setQueryData(["post", params.id], context?.previousPost);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", params.id] });
    },
  });

  const { mutate: toggleBookmarkMutate } = useMutation({
    mutationFn: () => toggleBookmark(bookmark, params.id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["post", params.id],
      });

      const previousPost = queryClient.getQueryData(["post", params.id]);

      queryClient.setQueryData(
        ["post", params.id],
        (
          old: PostType & {
            bookmarks: (BookmarkType & { user: UserType })[];
          }
        ) => ({
          ...old,
          bookmarks: bookmark
            ? old.bookmarks.filter((b) => b.id !== bookmark.id)
            : [...old.bookmarks, { user: { id: user.id } }],
        })
      );

      return { previousPost };
    },
    onError: (error, _, context) => {
      toast.error(error.message);
      queryClient.setQueryData(["post", params.id], context?.previousPost);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", params.id] });
    },
  });

  const { mutate: createCommentMutate } = useMutation({
    mutationFn: (comment: string) => createComment(params.id, comment),
    onMutate: async (comment) => {
      await queryClient.cancelQueries({
        queryKey: ["post", params.id],
      });

      const previousPost = queryClient.getQueryData(["post", params.id]);

      queryClient.setQueryData(
        ["post", params.id],
        (
          old: PostType & {
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
                avatar: user.avatar,
                username: user.username,
                name: user.name,
              },
            },
          ],
        })
      );

      return { previousPost };
    },
    onError: (error, _, context) => {
      toast.error(error.message);
      queryClient.setQueryData(["post", params.id], context?.previousPost);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", params.id] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    form.reset();
    createCommentMutate(data.comment);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isPending) {
    return <PostSkeleton />;
  }

  if (error) {
    toast.error(error.message);
    return <div>{error.message}</div>;
  }

  const like = post.likes.find((l) => l.user.id === user.id);
  const bookmark = post.bookmarks.find((b) => b.user.id === user.id);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <Image
          src={post.image}
          alt="Post image"
          width={1920}
          height={1080}
          className={`${fromHomeFeed ? "cursor-pointer" : ""}`}
          onClick={
            fromHomeFeed ? () => router.push(`/post/${post.id}`) : undefined
          }
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleLikeMutate()}
            >
              <Heart
                size={32}
                absoluteStrokeWidth
                stroke={like ? "red" : theme === "light" ? "black" : "white"}
                fill={like ? "red" : theme === "light" ? "white" : "black"}
              />
            </Button>
            <p>{post.likes.length}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleBookmarkMutate()}
          >
            <Bookmark
              size={32}
              absoluteStrokeWidth
              fill={
                bookmark
                  ? theme === "light"
                    ? "black"
                    : "white"
                  : theme === "light"
                  ? "white"
                  : "black"
              }
            />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Comment
          user={post.user}
          comment={post.caption}
          createdAt={post.createdAt}
          size={12}
        />
        <Separator />
        {showComments &&
          post.comments.map((comment) => (
            <Comment
              user={comment.user}
              comment={comment.comment}
              createdAt={comment.createdAt}
              size={10}
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
            {showComments
              ? `Hide ${post.comments.length} comment${
                  post.comments.length > 1 ? "s" : ""
                }`
              : `Show ${post.comments.length} comment${
                  post.comments.length > 1 ? "s" : ""
                }`}
          </Button>
        )}
        <div className="flex gap-2">
          <UserAvatar user={user} size={10} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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

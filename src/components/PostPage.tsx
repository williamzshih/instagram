"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createComment, deleteComment, getComments } from "@/actions/comment";
import { deletePost, getPost } from "@/actions/post";
import { toggleBookmark, toggleLike } from "@/actions/post";
import Comment from "@/components/Comment";
import ProfilePicture from "@/components/ProfilePicture";
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
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { COMMENT_MAX } from "@/limits";
import { useUserStore } from "@/store/user";

const formSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(COMMENT_MAX, {
      message: `Comment must be at most ${COMMENT_MAX} characters long`,
    }),
});

type Post = NonNullable<Awaited<ReturnType<typeof getPost>>>;

type Props = {
  home?: boolean;
  initialBookmark: boolean;
  initialLike: boolean;
  post: Post;
};

export default function PostPage({
  home,
  initialBookmark,
  initialLike,
  post,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [commentsVisible, setCommentsVisible] = useState(!home);
  const [bookmarked, setBookmarked] = useState(initialBookmark);
  const [liked, setLiked] = useState(initialLike);
  const [likes, toggleLikes] = useToggle(
    post._count.likes,
    post._count.likes + (initialLike ? -1 : 1)
  );

  const form = useForm({
    defaultValues: {
      comment: "",
    },
    resolver: zodResolver(formSchema),
  });

  const {
    data,
    error,
    isPending: gettingComments,
  } = useQuery({
    queryFn: () => getComments(post.id),
    queryKey: ["postPage", post.id],
  });

  const {
    isPending: creatingComment,
    mutate: createCommentMutation,
    variables: creatingCommentComment,
  } = useMutation({
    mutationFn: (comment: string) => {
      if (!user) return Promise.resolve();
      createComment({
        comment,
        postId: post.id,
        userId: user.id,
      });
      return Promise.resolve();
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["postPage", post.id] }),
  });

  const {
    isPending: deletingComment,
    mutate: deleteCommentMutation,
    variables: deletingCommentId,
  } = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["postPage", post.id] }),
  });

  const user = useUserStore((state) => state.user);
  if (!user) return;

  if (error) {
    console.error("Error getting comments:", error);
    throw new Error("Error getting comments:", { cause: error });
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      form.reset();
      createCommentMutation(data.comment);
      toast.success("Comment created");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      toast.success("Post deleted");
      router.back();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      deleteCommentMutation(id);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleLike = async () => {
    try {
      setLiked(!liked);
      toggleLikes();
      await toggleLike({
        liked,
        postId: post.id,
        userId: user.id,
      });
      toast.success(liked ? "Unliked post" : "Liked post");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleBookmark = async () => {
    try {
      setBookmarked(!bookmarked);
      await toggleBookmark({
        bookmarked,
        postId: post.id,
        userId: user.id,
      });
      toast.success(bookmarked ? "Unbookmarked post" : "Bookmarked post");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {home ? (
          <Link href={`/post/${post.id}`}>
            <Image
              alt="Post image"
              height={1000}
              priority
              src={`${post.image}?img-width=1000&img-height=1000`}
              width={1000}
            />
          </Link>
        ) : (
          <Image
            alt="Post image"
            height={1000}
            priority
            src={`${post.image}?img-width=1000&img-height=1000`}
            width={1000}
          />
        )}
        <div className="flex justify-between">
          <div className={cn("flex items-center gap-2", home && "lg:ml-4")}>
            <Button
              className="cursor-pointer"
              onClick={handleLike}
              size="icon"
              variant="ghost"
            >
              <Heart
                className="size-8"
                fill={liked ? "red" : "background"}
                stroke={liked ? "red" : "currentColor"}
              />
            </Button>
            <p className="text-lg">{likes}</p>
          </div>
          <Button
            className="cursor-pointer"
            onClick={handleBookmark}
            size="icon"
            variant="ghost"
          >
            <Bookmark
              className="size-8"
              fill={bookmarked ? "currentColor" : "background"}
            />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Comment
          comment={post.caption}
          onClick={post.user.id === user.id ? handleDeletePost : undefined}
          size={16}
          {...post}
        />
        <Separator />
        {commentsVisible &&
          !gettingComments &&
          data.map((comment) => (
            <div
              className={cn(
                deletingComment &&
                  deletingCommentId === comment.id &&
                  "opacity-50"
              )}
              key={comment.id}
            >
              <Comment
                onClick={
                  comment.user.id === user.id
                    ? () => handleDeleteComment(comment.id)
                    : undefined
                }
                size={12}
                {...comment}
              />
            </div>
          ))}
        {creatingComment && (
          <div className="opacity-50">
            <Comment
              comment={creatingCommentComment}
              createdAt={new Date()}
              size={12}
              user={user}
            />
          </div>
        )}
        {gettingComments ? (
          <div className="flex justify-center">
            <LoaderCircle className="animate-spin" size={48} />
          </div>
        ) : (
          data.length > 0 && (
            <div className="flex justify-center">
              <Button
                className="cursor-pointer"
                onClick={() => setCommentsVisible(!commentsVisible)}
                variant="ghost"
              >
                {commentsVisible ? "Hide comments" : "Show comments"}
              </Button>
            </div>
          )
        )}
        <div className="flex items-center gap-4">
          <ProfilePicture size={12} user={user} />
          <Form {...form}>
            <form className="w-full">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Comment"
                        rows={3}
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

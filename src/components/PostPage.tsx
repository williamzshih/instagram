"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark, Heart, Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { create } from "zustand";
import {
  createComment,
  deleteComment as deleteCommentAction,
} from "@/actions/comment";
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
import useToggle from "@/hooks/useToggle";
import { COMMENT_MAX } from "@/limits";
import { useUserStore } from "@/store/userStore";

const formSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(COMMENT_MAX, {
      message: `Comment must be at most ${COMMENT_MAX} characters long`,
    }),
});

type CommentStore = {
  addComment: (comment: Comment) => void;
  comments: Comment[];
  deleteComment: (id: string) => void;
  setComments: (comments: Comment[]) => void;
};

const useCommentStore = create<CommentStore>((set) => ({
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
  comments: [],
  deleteComment: (id) =>
    set((state) => ({
      comments: state.comments.filter((c) => c.id !== id),
    })),
  setComments: (comments) => set({ comments }),
}));

type Comment = Post["comments"][number];
type Post = NonNullable<Awaited<ReturnType<typeof getPost>>>;

type Props = {
  initialBookmark: boolean;
  initialLike: boolean;
  link?: boolean;
  post: Post;
};

export default function Post({
  initialBookmark,
  initialLike,
  link,
  post,
}: Props) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmark);
  const [liked, setLiked] = useState(initialLike);
  const [likes, toggleLikes] = useToggle(
    post._count.likes,
    post._count.likes + (initialLike ? -1 : 1),
    post._count.likes
  );

  const form = useForm({
    defaultValues: {
      comment: "",
    },
    resolver: zodResolver(formSchema),
  });

  const setComments = useCommentStore((state) => state.setComments);
  useEffect(() => setComments(post.comments), [post.comments, setComments]);

  const comments = useCommentStore((state) => state.comments);
  const addComment = useCommentStore((state) => state.addComment);
  const deleteComment = useCommentStore((state) => state.deleteComment);

  const user = useUserStore((state) => state.user);
  if (!user) return;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      form.reset();
      addComment({
        comment: data.comment,
        createdAt: new Date(),
        id: crypto.randomUUID(),
        user,
      });
      await createComment({
        comment: data.comment,
        postId: post.id,
        userId: user.id,
      });
      toast.success("Comment created");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      toast.success("Post deleted");
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      deleteComment(id);
      await deleteCommentAction(id);
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
        {link ? (
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
          <div className="flex items-center gap-2">
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
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            onClick={
              comment.user.id === user.id
                ? () => handleDeleteComment(comment.id)
                : undefined
            }
            size={12}
            {...comment}
          />
        ))}
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

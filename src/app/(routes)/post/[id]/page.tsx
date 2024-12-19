"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getLike, getPost, toggleLike } from "@/utils/actions";
import CommentForm from "@/components/CommentForm";
import Comment from "@/components/Comment";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Post as PostType,
  User as UserType,
  Comment as CommentType,
  Like as LikeType,
} from "@prisma/client";

export default function Post({ params }: { params: { id: string } }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [post, setPost] = useState<
    | (PostType & {
        user: UserType;
        comments: (CommentType & { user: UserType })[];
        likes: LikeType[];
      })
    | null
  >(null);
  const [like, setLike] = useState<LikeType | null>(null);

  useEffect(() => {
    const fetchPost = async () => setPost(await getPost(params.id));
    const fetchLike = async () => setLike(await getLike(params.id));
    fetchPost();
    fetchLike();
  }, []);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        Post not found
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col">
          <img
            src={post.image}
            alt="Post"
            className="rounded-lg object-cover mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => setLike(await toggleLike(post.id))}
              >
                {like ? (
                  <Heart
                    size={32}
                    absoluteStrokeWidth
                    stroke="red"
                    fill="red"
                  />
                ) : (
                  <Heart size={32} absoluteStrokeWidth />
                )}
              </Button>
              <p>{post.likes.length}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBookmarked(!bookmarked)}
            >
              {bookmarked ? (
                <Bookmark
                  size={32}
                  absoluteStrokeWidth
                  fill="black"
                  stroke="black"
                />
              ) : (
                <Bookmark size={32} absoluteStrokeWidth />
              )}
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
              {post.user.name}
              <p className="text-sm text-gray-500">@{post.user.username}</p>
            </div>
          </div>
          <p className="bg-gray-100 p-2 rounded-lg">{post.caption}</p>
          <div className="text-sm text-gray-500 text-right mb-4">
            {post.createdAt.toLocaleDateString()}
          </div>
          <div className="w-full h-px bg-gray-200 mb-4"></div>
          {post.comments.map((comment) => (
            <Comment comment={comment} />
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
  );
}

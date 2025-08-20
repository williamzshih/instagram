"use server";

import { getUserId } from "@/actions/profile";
import { prisma } from "@/db";

export const toggleBookmark = async (postId: string, isBookmarked: boolean) => {
  try {
    const userId = await getUserId();
    if (isBookmarked)
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
    else
      await prisma.bookmark.create({
        data: { postId, userId },
      });
  } catch (error) {
    const message = isBookmarked
      ? "Error unbookmarking post:"
      : "Error bookmarking post:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

export const toggleLike = async (postId: string, isLiked: boolean) => {
  try {
    const userId = await getUserId();
    if (isLiked)
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
    else
      await prisma.like.create({
        data: { postId, userId },
      });
  } catch (error) {
    const message = isLiked ? "Error unliking post:" : "Error liking post:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

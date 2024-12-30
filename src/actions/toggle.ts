"use server";

import { prisma } from "@/db";
import {
  Like as LikeType,
  Bookmark as BookmarkType,
  Follow as FollowType,
} from "@prisma/client";
import { getEmail } from "@/actions/actions";

export async function toggleLike(like: LikeType | undefined, postId: string) {
  try {
    if (like) {
      await prisma.like.delete({
        where: { id: like.id },
      });
    } else {
      const email = await getEmail();
      await prisma.like.create({
        data: { email, postId },
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Error toggling like", { cause: error });
  }
}

export async function toggleBookmark(
  bookmark: BookmarkType | undefined,
  postId: string
) {
  try {
    if (bookmark) {
      await prisma.bookmark.delete({
        where: { id: bookmark.id },
      });
    } else {
      const email = await getEmail();
      await prisma.bookmark.create({
        data: { email, postId },
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw new Error("Error toggling bookmark", { cause: error });
  }
}

export async function toggleFollow(
  follow: FollowType | undefined,
  username: string
) {
  try {
    if (follow) {
      await prisma.follow.delete({
        where: { id: follow.id },
      });
    } else {
      const email = await getEmail();
      return await prisma.follow.create({
        data: { email, followingUsername: username },
      });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Error toggling follow", { cause: error });
  }
}

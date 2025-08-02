"use server";

import { prisma } from "@/db";
import { getUserId } from "@/actions/profile";

export async function toggleLike(id: string | undefined, postId: string) {
  try {
    if (id) {
      await prisma.like.delete({
        where: { id },
      });
    } else {
      const userId = await getUserId();
      await prisma.like.create({
        data: { userId, postId },
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Error toggling like", { cause: error });
  }
}

export async function toggleBookmark(id: string | undefined, postId: string) {
  try {
    if (id) {
      await prisma.bookmark.delete({
        where: { id },
      });
    } else {
      const userId = await getUserId();
      await prisma.bookmark.create({
        data: { userId, postId },
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw new Error("Error toggling bookmark", { cause: error });
  }
}

"use server";

import { prisma } from "@/db";
import { getEmail } from "@/actions/actions";

export async function toggleLike(id: string | undefined, postId: string) {
  try {
    if (id) {
      await prisma.like.delete({
        where: { id },
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

export async function toggleBookmark(id: string | undefined, postId: string) {
  try {
    if (id) {
      await prisma.bookmark.delete({
        where: { id },
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

export async function toggleFollow(id: string | undefined, username: string) {
  try {
    if (id) {
      await prisma.follow.delete({
        where: { id },
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

"use server";

import { prisma } from "@/db";
import { getEmail } from "@/actions/actions";

export async function createComment(postId: string, comment: string) {
  try {
    const email = await getEmail();
    await prisma.comment.create({
      data: { email, postId, comment },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Error creating comment", { cause: error });
  }
}

export async function deleteComment(id: string) {
  try {
    await prisma.comment.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Error deleting comment", { cause: error });
  }
}

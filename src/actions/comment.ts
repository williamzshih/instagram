"use server";

import { prisma } from "@/db";

export const createComment = async (data: {
  comment: string;
  postId: string;
  userId: string;
}) => {
  try {
    await prisma.comment.create({
      data,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Error creating comment:", { cause: error });
  }
};

export const deleteComment = async (id: string) => {
  try {
    await prisma.comment.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Error deleting comment:", { cause: error });
  }
};

"use server";

import { prisma } from "@/prisma";

export const getComments = async (postId: string) => {
  try {
    return await prisma.comment.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        comment: true,
        createdAt: true,
        id: true,
        user: {
          select: {
            id: true,
            image: true,
            name: true,
            username: true,
          },
        },
      },
      where: { postId },
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    throw new Error("Error getting comments:", { cause: error });
  }
};

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

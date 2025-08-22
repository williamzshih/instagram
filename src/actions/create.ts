"use server";

import { prisma } from "@/db";

export const createPost = async (data: {
  caption: string;
  image: string;
  userId: string;
}) => {
  try {
    return (
      await prisma.post.create({
        data,
      })
    ).id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post:", { cause: error });
  }
};

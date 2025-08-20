"use server";

import { prisma } from "@/db";

export const searchUsers = async (q: string) => {
  try {
    return await prisma.user1.findMany({
      orderBy: {
        username: "asc",
      },
      select: {
        avatar: true,
        id: true,
        name: true,
        username: true,
      },
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Error searching users:", { cause: error });
  }
};

export const searchPosts = async (q: string) => {
  try {
    return await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        caption: true,
        createdAt: true,
        id: true,
        image: true,
        user: {
          select: {
            avatar: true,
            name: true,
            username: true,
          },
        },
      },
      where: {
        caption: {
          contains: q,
        },
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Error searching posts:", { cause: error });
  }
};

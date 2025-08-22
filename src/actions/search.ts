"use server";

import { prisma } from "@/db";

export const searchUsers = async (search: string) => {
  try {
    return await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        image: true,
        name: true,
        username: true,
      },
      where: {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Error searching users:", { cause: error });
  }
};

export const searchPosts = async (search: string) => {
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
      },
      where: {
        OR: [
          {
            caption: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
              username: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Error searching posts:", { cause: error });
  }
};

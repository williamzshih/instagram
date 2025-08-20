"use server";

import { Prisma } from "@prisma/client";
import { getUserId } from "@/actions/profile";
import { prisma } from "@/db";

export const getPost = async (id: string) => {
  try {
    return await prisma.post.findUnique({
      select: {
        caption: true,
        createdAt: true,
        id: true,
        image: true,
        user: {
          select: {
            avatar: true,
            id: true,
            name: true,
            username: true,
          },
        },
      },
      where: { id },
    });
  } catch (error) {
    console.error("Error getting post:", error);
    throw new Error("Error getting post:", { cause: error });
  }
};

export const getPosts = async (userId: string) => {
  try {
    const following = await prisma.user.findUnique({
      select: {
        following: {
          select: {
            followee: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: { id: userId },
    });

    if (!following) throw new Error("User not found");

    return await prisma.post.findMany({
      select: {
        _count: {
          select: {
            likes: true,
          },
        },
        bookmarks: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        id: true,
        likes: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      take: 10,
      where: {
        user: {
          id: {
            in: following.following.map((follow) => follow.followee.id),
          },
        },
      },
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    throw new Error("Error getting posts:", { cause: error });
  }
};

export const getSortedPosts = async (sortBy: string) => {
  try {
    let orderBy: Prisma.PostOrderByWithRelationInput;

    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "trending":
        orderBy = {
          likes: {
            _count: "desc",
          },
        };
        break;
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    return await prisma.post.findMany({
      orderBy,
      select: {
        caption: true,
        createdAt: true,
        id: true,
        image: true,
      },
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    throw new Error("Error getting posts:", { cause: error });
  }
};

export const createPost = async (data: { caption: string; image: string }) => {
  try {
    return (
      await prisma.post.create({
        data: {
          ...data,
          userId: await getUserId(),
        },
      })
    ).id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post:", { cause: error });
  }
};

export const deletePost = async (id: string) => {
  try {
    await prisma.post.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Error deleting post:", { cause: error });
  }
};

"use server";

import { Prisma } from "@prisma/client";
import { getUserId } from "@/actions/profile";
import { prisma } from "@/db";

export const getPosts = async (sortBy: string) => {
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

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Error deleting post", { cause: error });
  }
}

export async function getPost(id: string) {
  try {
    const [basicInfo, likes, bookmarks, comments] = await Promise.all([
      prisma.post.findUnique({
        where: { id },
        select: {
          id: true,
          image: true,
          caption: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              name: true,
            },
          },
        },
      }),
      prisma.like.findMany({
        where: { postId: id },
        select: {
          id: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.bookmark.findMany({
        where: { postId: id },
        select: {
          id: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.comment.findMany({
        where: { postId: id },
        select: {
          id: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              name: true,
            },
          },
        },
      }),
    ]);

    if (!basicInfo) {
      return null;
    }

    return {
      ...basicInfo,
      likes,
      bookmarks,
      comments,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Error fetching post", { cause: error });
  }
}


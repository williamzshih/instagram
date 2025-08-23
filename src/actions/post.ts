"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/db";

export const getPost = async (id: string) => {
  try {
    return await prisma.post.findUnique({
      select: {
        _count: {
          select: {
            likes: true,
          },
        },
        caption: true,
        comments: {
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
        },
        createdAt: true,
        id: true,
        image: true,
        user: {
          select: {
            id: true,
            image: true,
            name: true,
            username: true,
          },
        },
      },
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error getting post:", error);
    throw new Error("Error getting post:", { cause: error });
  }
};

export const getFollowingPosts = async (followerId: string) => {
  try {
    const follows = await prisma.follow.findMany({
      select: {
        followeeId: true,
      },
      where: {
        followerId,
      },
    });

    return await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        _count: {
          select: {
            likes: true,
          },
        },
        caption: true,
        comments: {
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
        },
        createdAt: true,
        id: true,
        image: true,
        user: {
          select: {
            id: true,
            image: true,
            name: true,
            username: true,
          },
        },
      },
      where: {
        userId: {
          in: follows.map((follow) => follow.followeeId),
        },
      },
    });
  } catch (error) {
    console.error("Error getting your followed users' posts:", error);
    throw new Error("Error getting your followed users' posts:", {
      cause: error,
    });
  }
};

export const getSortedPosts = async (sort: string) => {
  try {
    let orderBy: Prisma.PostOrderByWithRelationInput;

    switch (sort) {
      case "Least comments":
        orderBy = { comments: { _count: "asc" } };
        break;
      case "Least likes":
        orderBy = { likes: { _count: "asc" } };
        break;
      case "Most comments":
        orderBy = { comments: { _count: "desc" } };
        break;
      case "Most likes":
        orderBy = { likes: { _count: "desc" } };
        break;
      case "Newest":
        orderBy = { createdAt: "desc" };
        break;
      case "Oldest":
        orderBy = { createdAt: "asc" };
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
    console.error("Error getting sorted posts:", error);
    throw new Error("Error getting sorted posts:", { cause: error });
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

export const getInitialBookmark = async (userId_postId: {
  postId: string;
  userId: string;
}) => {
  try {
    return !!(await prisma.bookmark.findUnique({
      where: { userId_postId },
    }));
  } catch (error) {
    console.error("Error getting initial bookmark:", error);
    throw new Error("Error getting initial bookmark:", { cause: error });
  }
};

export const getInitialLike = async (userId_postId: {
  postId: string;
  userId: string;
}) => {
  try {
    return !!(await prisma.like.findUnique({
      where: {
        userId_postId,
      },
    }));
  } catch (error) {
    console.error("Error getting initial like:", error);
    throw new Error("Error getting initial like:", { cause: error });
  }
};

export const toggleBookmark = async ({
  bookmarked,
  postId,
  userId,
}: {
  bookmarked: boolean;
  postId: string;
  userId: string;
}) => {
  try {
    if (bookmarked)
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
    else
      await prisma.bookmark.create({
        data: { postId, userId },
      });
  } catch (error) {
    const message = bookmarked
      ? "Error unbookmarking post:"
      : "Error bookmarking post:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

export const toggleLike = async ({
  liked,
  postId,
  userId,
}: {
  liked: boolean;
  postId: string;
  userId: string;
}) => {
  try {
    if (liked)
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
    else
      await prisma.like.create({
        data: { postId, userId },
      });
  } catch (error) {
    const message = liked ? "Error unliking post:" : "Error liking post:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

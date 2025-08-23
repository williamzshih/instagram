"use server";

import { prisma } from "@/db";

const commentUser = {
  select: {
    id: true,
    image: true,
    name: true,
    username: true,
  },
};

const postPageSelect = {
  _count: {
    select: {
      likes: true,
    },
  },
  caption: true,
  comments: {
    orderBy: {
      createdAt: "desc" as const,
    },
    select: {
      comment: true,
      createdAt: true,
      id: true,
      user: commentUser,
    },
  },
  createdAt: true,
  id: true,
  image: true,
  user: commentUser,
};

const postGridSelect = {
  caption: true,
  createdAt: true,
  id: true,
  image: true,
};

export const getPost = async (id: string) => {
  try {
    return await prisma.post.findUnique({
      select: postPageSelect,
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
      select: postPageSelect,
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
  let orderBy;

  switch (sort) {
    case "Least comments":
      orderBy = { comments: { _count: "asc" as const } };
      break;
    case "Least likes":
      orderBy = { likes: { _count: "asc" as const } };
      break;
    case "Most comments":
      orderBy = { comments: { _count: "desc" as const } };
      break;
    case "Most likes":
      orderBy = { likes: { _count: "desc" as const } };
      break;
    case "Newest":
      orderBy = { createdAt: "desc" as const };
      break;
    case "Oldest":
      orderBy = { createdAt: "asc" as const };
      break;
    default:
      orderBy = { createdAt: "desc" as const };
      break;
  }

  try {
    return await prisma.post.findMany({
      orderBy,
      select: postGridSelect,
    });
  } catch (error) {
    console.error("Error getting sorted posts:", error);
    throw new Error("Error getting sorted posts:", { cause: error });
  }
};

export const searchPosts = async (search: string) => {
  try {
    return await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: postGridSelect,
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

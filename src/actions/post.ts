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
            realUser: {
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
        realUser: {
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

export const deletePost = async (id: string) => {
  try {
    await prisma.post.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Error deleting post:", { cause: error });
  }
};

export const getInitialLiked = async (realUserId_postId: {
  postId: string;
  realUserId: string;
}) => {
  try {
    return !!(await prisma.like.findUnique({
      where: {
        realUserId_postId,
      },
    }));
  } catch (error) {
    console.error("Error getting initial liked:", error);
    throw new Error("Error getting initial liked:", { cause: error });
  }
};

export const getInitialBookmarked = async (realUserId_postId: {
  postId: string;
  realUserId: string;
}) => {
  try {
    return !!(await prisma.bookmark.findUnique({
      where: { realUserId_postId },
    }));
  } catch (error) {
    console.error("Error getting initial bookmarked:", error);
    throw new Error("Error getting initial bookmarked:", { cause: error });
  }
};

export const toggleLike = async ({
  liked,
  postId,
  realUserId,
}: {
  liked: boolean;
  postId: string;
  realUserId: string;
}) => {
  try {
    if (liked)
      await prisma.like.delete({
        where: {
          realUserId_postId: {
            postId,
            realUserId,
          },
        },
      });
    else
      await prisma.like.create({
        data: { postId, realUserId },
      });
  } catch (error) {
    const message = liked ? "Error unliking post:" : "Error liking post:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

export const toggleBookmark = async ({
  bookmarked,
  postId,
  realUserId,
}: {
  bookmarked: boolean;
  postId: string;
  realUserId: string;
}) => {
  try {
    if (bookmarked)
      await prisma.bookmark.delete({
        where: {
          realUserId_postId: {
            postId,
            realUserId,
          },
        },
      });
    else
      await prisma.bookmark.create({
        data: { postId, realUserId },
      });
  } catch (error) {
    const message = bookmarked
      ? "Error unbookmarking post:"
      : "Error bookmarking post:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

export const getPostInitial = async (id: string) => {
  try {
    return await prisma.post.findUnique({
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
      where: { id },
    });
  } catch (error) {
    console.error("Error getting post:", error);
    throw new Error("Error getting post:", { cause: error });
  }
};

export const getPosts = async (userId: string) => {
  try {
    const following = await prisma.user1.findUnique({
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
        createdAt: true,
        id: true,
        image: true,
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

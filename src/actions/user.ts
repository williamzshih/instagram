"use server";

import { prisma } from "@/db";

export const getUser = async (username: string) => {
  try {
    return await prisma.user.findUnique({
      select: {
        bio: true,
        bookmarks: {
          select: {
            createdAt: true,
            id: true,
            post: {
              select: {
                id: true,
                image: true,
              },
            },
          },
        },
        createdAt: true,
        followers: {
          select: {
            createdAt: true,
            follower: {
              select: {
                image: true,
                name: true,
                username: true,
              },
            },
            id: true,
          },
        },
        following: {
          select: {
            createdAt: true,
            followee: {
              select: {
                image: true,
                name: true,
                username: true,
              },
            },
            id: true,
          },
        },
        id: true,
        image: true,
        likes: {
          select: {
            createdAt: true,
            id: true,
            post: {
              select: {
                id: true,
                image: true,
              },
            },
          },
        },
        name: true,
        posts: {
          select: {
            createdAt: true,
            id: true,
            image: true,
          },
        },
        username: true,
      },
      where: { username },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Error getting user:", { cause: error });
  }
};

export const updateUser = async ({
  data,
  id,
}: {
  data: {
    bio: string;
    image?: null | string;
    name?: null | string;
    username: string;
  };
  id: string;
}) => {
  try {
    await prisma.user.update({ data, where: { id } });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user:", { cause: error });
  }
};

export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user:", { cause: error });
  }
};

export const checkUsername = async (username: string) => {
  try {
    return !(await prisma.user.findUnique({
      where: { username },
    }));
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw new Error("Error checking username availability:", { cause: error });
  }
};

export const getInitialFollowing = async (realFollowerId_realFolloweeId: {
  realFolloweeId: string;
  realFollowerId: string;
}) => {
  try {
    return !!(await prisma.follow.findUnique({
      where: {
        realFollowerId_realFolloweeId,
      },
    }));
  } catch (error) {
    console.error("Error getting initial follow:", error);
    throw new Error("Error getting initial follow:", { cause: error });
  }
};

export const toggleFollow = async ({
  following,
  realFolloweeId,
  realFollowerId,
}: {
  following: boolean;
  realFolloweeId: string;
  realFollowerId: string;
}) => {
  try {
    if (following)
      await prisma.follow.delete({
        where: {
          realFollowerId_realFolloweeId: {
            realFolloweeId,
            realFollowerId,
          },
        },
      });
    else
      await prisma.follow.create({
        data: { realFolloweeId, realFollowerId },
      });
  } catch (error) {
    const message = following
      ? "Error unfollowing user:"
      : "Error following user:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

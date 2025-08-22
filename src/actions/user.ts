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

export const getInitialFollow = async (followerId_followeeId: {
  followeeId: string;
  followerId: string;
}) => {
  try {
    return !!(await prisma.follow.findUnique({
      where: {
        followerId_followeeId,
      },
    }));
  } catch (error) {
    console.error("Error getting initial follow:", error);
    throw new Error("Error getting initial follow:", { cause: error });
  }
};

export const toggleFollow = async ({
  followed,
  followeeId,
  followerId,
}: {
  followed: boolean;
  followeeId: string;
  followerId: string;
}) => {
  try {
    if (followed)
      await prisma.follow.delete({
        where: {
          followerId_followeeId: {
            followeeId,
            followerId,
          },
        },
      });
    else
      await prisma.follow.create({
        data: { followeeId, followerId },
      });
  } catch (error) {
    const message = followed
      ? "Error unfollowing user:"
      : "Error following user:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

export const deleteFollow = async (id: string) => {
  try {
    await prisma.follow.delete({ where: { id } });
  } catch (error) {
    console.error("Error removing follow:", error);
    throw new Error("Error removing follow:", { cause: error });
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

export const updateUser = async ({
  data,
  id,
}: {
  data: {
    bio: string;
    image: string;
    name: string;
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

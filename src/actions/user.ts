"use server";

import { prisma } from "@/prisma";

const postGridTransformSelect = {
  createdAt: true,
  post: {
    select: {
      caption: true,
      id: true,
      image: true,
    },
  },
};

const followUser = {
  select: {
    image: true,
    name: true,
    username: true,
  },
};

const commentUserSelect = {
  id: true,
  image: true,
  name: true,
  username: true,
};

export const getUser = async (username: string) => {
  try {
    return await prisma.user.findUnique({
      select: {
        bio: true,
        bookmarks: {
          orderBy: {
            createdAt: "desc",
          },
          select: postGridTransformSelect,
        },
        createdAt: true,
        followers: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            createdAt: true,
            follower: followUser,
            id: true,
          },
        },
        following: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            createdAt: true,
            followee: followUser,
            id: true,
          },
        },
        id: true,
        image: true,
        likes: {
          orderBy: {
            createdAt: "desc",
          },
          select: postGridTransformSelect,
        },
        name: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            caption: true,
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

export const searchUsers = async (search: string) => {
  try {
    return await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      select: commentUserSelect,
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

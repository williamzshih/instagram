"use server";

import { auth } from "@/auth";
import { prisma } from "@/db";

export const getUserId = async () => {
  try {
    const session = await auth();
    // TODO: fix this
    if (!session?.user?.email) throw new Error("Not signed in");
    const user = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email: session.user.email,
      },
    });
    // TODO: fix this
    if (!user) throw new Error("User not found");
    return user.id;
  } catch (error) {
    console.error("Error getting user id:", error);
    throw new Error("Error getting user id:", { cause: error });
  }
};

export const getProfile = async ({
  email,
  username,
}: {
  email?: string;
  username?: string;
}) => {
  try {
    const profile = await prisma.user.findUnique({
      select: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        avatar: true,
        bio: true,
        createdAt: true,
        id: true,
        name: true,
        username: true,
      },
      where: email ? { email } : { username },
    });
    return profile;
  } catch (error) {
    console.error("Error getting profile:", error);
    throw new Error("Error getting profile:", { cause: error });
  }
};

export const getPosts = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
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
      },
      where: { id },
    });
    if (!user) throw new Error("User not found");
    return user.posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw new Error("Error getting posts:", { cause: error });
  }
};

export const getLikes = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        likes: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            createdAt: true,
            post: {
              select: {
                caption: true,
                id: true,
                image: true,
              },
            },
          },
        },
      },
      where: { id },
    });
    if (!user) throw new Error("User not found");
    return user.likes.map((like) => ({
      ...like.post,
      createdAt: like.createdAt,
    }));
  } catch (error) {
    console.error("Error getting likes:", error);
    throw new Error("Error getting likes:", { cause: error });
  }
};

export const getBookmarks = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        bookmarks: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            createdAt: true,
            post: {
              select: {
                caption: true,
                id: true,
                image: true,
              },
            },
          },
        },
      },
      where: { id },
    });
    if (!user) throw new Error("User not found");
    return user.bookmarks.map((bookmark) => ({
      ...bookmark.post,
      createdAt: bookmark.createdAt,
    }));
  } catch (error) {
    console.error("Error getting bookmarks:", error);
    throw new Error("Error getting bookmarks:", { cause: error });
  }
};

export const getFollowers = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        followers: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            createdAt: true,
            follower: {
              select: {
                avatar: true,
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
      where: { id },
    });
    if (!user) throw new Error("User not found");
    return user.followers.map((follow) => ({
      ...follow.follower,
      createdAt: follow.createdAt,
    }));
  } catch (error) {
    console.error("Error getting followers:", error);
    throw new Error("Error getting followers:", { cause: error });
  }
};

export const getFollowing = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        following: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            createdAt: true,
            followee: {
              select: {
                avatar: true,
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
      where: { id },
    });
    if (!user) throw new Error("User not found");
    return user.following.map((follow) => ({
      ...follow.followee,
      createdAt: follow.createdAt,
    }));
  } catch (error) {
    console.error("Error getting followed users:", error);
    throw new Error("Error getting followed users:", { cause: error });
  }
};

export const toggleFollow = async (followeeId: string, following: boolean) => {
  try {
    const userId = await getUserId();
    if (following) await removeFollow(userId, followeeId, "unfollow");
    else await addFollow(userId, followeeId);
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Error toggling follow:", { cause: error });
  }
};

export const removeFollow = async (
  followerId: string,
  followeeId: string,
  type: "remove" | "unfollow"
) => {
  try {
    await prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followeeId,
          followerId,
        },
      },
    });
  } catch (error) {
    const message =
      type === "remove"
        ? "Error removing follower:"
        : "Error unfollowing user:";
    console.error(message, error);
    throw new Error(message, { cause: error });
  }
};

const addFollow = async (followerId: string, followeeId: string) => {
  try {
    await prisma.follow.create({
      data: { followeeId, followerId },
    });
  } catch (error) {
    console.error("Error following user:", error);
    throw new Error("Error following user:", { cause: error });
  }
};

export const checkFollow = async (followeeId: string) => {
  try {
    return !!(await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followeeId,
          followerId: await getUserId(),
        },
      },
    }));
  } catch (error) {
    console.error("Error checking if following:", error);
    throw new Error("Error checking if following:", { cause: error });
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

export const createUser = async (
  email: string,
  username: string,
  name: string,
  avatar?: string
) => {
  try {
    await prisma.user.create({
      data: { avatar, email, name, username },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user", { cause: error });
  }
};

export const updateUser = async (
  id: string,
  data: {
    avatar: string;
    bio: string;
    name: string;
    username: string;
  }
) => {
  try {
    await prisma.user.update({
      data,
      where: { id },
    });
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

"use server";

import { auth } from "@/auth";
import { prisma } from "@/db";

export const getUserId = async () => {
  try {
    const session = await auth();
    // TODO: fix this
    if (!session?.user?.email) throw new Error("Not signed in");
    const user = await prisma.user1.findUnique({
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

export const getProfileRedirect = async ({
  email,
  username,
}: {
  email?: string;
  username?: string;
}) => {
  try {
    const profile = await prisma.user1.findUnique({
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
    const user = await prisma.user1.findUnique({
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
    const user = await prisma.user1.findUnique({
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
    const user = await prisma.user1.findUnique({
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
    const user = await prisma.user1.findUnique({
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
    const user = await prisma.user1.findUnique({
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

export const createUser = async (data: {
  avatar?: string;
  email: string;
  name: string;
  username: string;
}) => {
  try {
    await prisma.user1.create({
      data,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user:", { cause: error });
  }
};

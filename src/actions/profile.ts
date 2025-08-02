"use server";

import { getEmail, getUserId } from "@/actions/actions";
import { prisma } from "@/db";

// check unnecessary exports
export const getProfile = async (username?: string) => {
  try {
    const profile = await prisma.user.findUnique({
      where: username ? { username } : { email: await getEmail() },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    // couldn't find other user
    if (username && !profile) throw new Error("User not found");

    return {
      profile,
      isFollowing: username ? await checkFollow(profile!.id) : false, // if username was provided, profile is not null
    };
  } catch (error) {
    // TODO: add error handling
    console.error("Error fetching profile:", error);
    throw new Error("Error fetching profile:", { cause: error });
  }
};

export const checkFollow = async (followeeId: string) => {
  try {
    return !!(await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: await getUserId(),
          followeeId,
        },
      },
    }));
  } catch (error) {
    console.error("Error checking if following:", error);
    throw new Error("Error checking if following:", { cause: error });
  }
};

export const getPosts = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        posts: {
          select: {
            id: true,
            image: true,
            caption: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts:", { cause: error });
  }
};

export const getLikes = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        likes: {
          select: {
            post: {
              select: {
                id: true,
                image: true,
                caption: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.likes.map((like) => ({
      ...like.post,
      createdAt: like.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw new Error("Error fetching likes:", { cause: error });
  }
};

export const getBookmarks = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        bookmarks: {
          select: {
            post: {
              select: {
                id: true,
                image: true,
                caption: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.bookmarks.map((bookmark) => ({
      ...bookmark.post,
      createdAt: bookmark.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw new Error("Error fetching bookmarks:", { cause: error });
  }
};

export const getFollowers = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                email: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return {
      followers: user.followers.map((follower) => ({
        ...follower.follower,
        createdAt: follower.createdAt,
      })),
      length: user.followers.length,
    };
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw new Error("Error fetching followers:", { cause: error });
  }
};

export const getFollowing = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        following: {
          select: {
            followee: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.following.map((following) => ({
      ...following.followee,
      createdAt: following.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching following:", error);
    throw new Error("Error fetching following:", { cause: error });
  }
};

// TODO: maybe change params after changing schema
export const removeFollow = async (
  followerId: string,
  followeeId: string,
  type: "remove" | "unfollow"
) => {
  try {
    await prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });
  } catch (error) {
    console.error(
      type === "remove"
        ? "Error removing follower:"
        : "Error unfollowing user:",
      error
    );
    throw new Error(
      type === "remove"
        ? "Error removing follower:"
        : "Error unfollowing user:",
      { cause: error }
    );
  }
};

const addFollow = async (followerId: string, followeeId: string) => {
  try {
    await prisma.follow.create({
      data: { followerId, followeeId },
    });
  } catch (error) {
    console.error("Error following user:", error);
    throw new Error("Error following user:", { cause: error });
  }
};

export const toggleFollow = async (
  followeeId: string,
  isFollowing: boolean
) => {
  try {
    const userId = await getUserId();

    if (isFollowing) await removeFollow(userId, followeeId, "unfollow");
    else await addFollow(userId, followeeId);
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Error toggling follow:", { cause: error });
  }
};

export const isUsernameAvailable = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return !user;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw new Error("Error checking username availability:", { cause: error });
  }
};

export const updateUser = async (
  username: string,
  data: {
    username: string;
    name: string;
    bio: string;
    avatar: string;
  }
) => {
  try {
    await prisma.user.update({
      where: { username },
      data,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user:", { cause: error });
  }
};

export const deleteUser = async (username: string) => {
  try {
    await prisma.user.delete({
      where: { username },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user:", { cause: error });
  }
};

export type Profile = NonNullable<
  Awaited<ReturnType<typeof getProfile>>["profile"]
>;
export type Post = Awaited<ReturnType<typeof getPosts>>[number];
export type Follower = Awaited<
  ReturnType<typeof getFollowers>
>["followers"][number];
export type Following = Awaited<ReturnType<typeof getFollowing>>[number];

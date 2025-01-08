"use server";

import { getEmail } from "@/actions/actions";
import { prisma } from "@/db";

export async function getUser() {
  try {
    const email = await getEmail();
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        avatar: true,
        name: true,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user", { cause: error });
  }
}

export async function getUserHome() {
  try {
    const email = await getEmail();
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        avatar: true,
        username: true,
        name: true,
        following: {
          select: {
            id: true,
            following: {
              select: {
                username: true,
                avatar: true,
                posts: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user", { cause: error });
  }
}

export async function getUserProfile() {
  try {
    const email = await getEmail();
    return await prisma.user.findUnique({
      where: { email },
      select: {
        username: true,
        name: true,
        bio: true,
        avatar: true,
        followers: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
                avatar: true,
                name: true,
              },
            },
          },
        },
        following: {
          select: {
            id: true,
            following: {
              select: {
                username: true,
                avatar: true,
                name: true,
              },
            },
          },
        },
        bookmarks: {
          select: {
            post: {
              select: {
                id: true,
                image: true,
              },
            },
          },
        },
        posts: {
          select: {
            id: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user", { cause: error });
  }
}

export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        name: true,
        bio: true,
        avatar: true,
        followers: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                name: true,
              },
            },
          },
        },
        following: {
          select: {
            id: true,
            following: {
              select: {
                username: true,
                avatar: true,
                name: true,
              },
            },
          },
        },
        posts: {
          select: {
            id: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw new Error("Error fetching user by username", { cause: error });
  }
}

export async function isUsernameAvailable(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {}
    });
    return !user;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw new Error("Error checking username availability", { cause: error });
  }
}

export async function updateUser(
  username: string,
  name: string,
  bio: string,
  avatar: string
) {
  try {
    const email = await getEmail();
    await prisma.user.update({
      where: { email },
      data: {
        username,
        name,
        bio,
        avatar,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user", { cause: error });
  }
}

export async function createUser(
  email: string,
  username: string,
  name: string,
  avatar?: string
) {
  try {
    await prisma.user.create({
      data: { email, username, name, avatar },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user", { cause: error });
  }
}

export async function searchUsers(q: string) {
  try {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      select: {
        username: true,
        name: true,
        avatar: true,
        id: true,
      },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Error searching users", { cause: error });
  }
}

export async function deleteUser() {
  try {
    const email = await getEmail();
    await prisma.user.delete({
      where: { email },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user", { cause: error });
  }
}

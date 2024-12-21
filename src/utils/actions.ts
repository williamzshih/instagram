"use server";

import {
  PrismaClient,
  Like as LikeType,
  Follow as FollowType,
} from "@prisma/client";
import { auth, signIn, signOut } from "@/auth";

const prisma = new PrismaClient();

export async function signInAction() {
  await signIn("google");
}

export async function signOutAction() {
  await signOut();
}

export async function getSession() {
  try {
    return await auth();
  } catch (error) {
    console.error("Error fetching session:", error);
    throw new Error("Error fetching session");
  }
}

async function getEmail() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  return session.user.email;
}

export async function updateUser(
  avatar: string,
  username: string,
  name: string,
  bio: string
) {
  try {
    const email = await getEmail();
    await prisma.user.update({
      where: { email },
      data: {
        avatar,
        username,
        name,
        bio,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
}

export async function getUser() {
  try {
    const email = await getEmail();
    return await prisma.user.findUnique({
      where: { email },
      include: {
        posts: true,
        following: true,
      },
    });
  } catch (error) {
    console.error(`Error fetching user: ${(error as Error).message}`);
    throw new Error(`Error fetching user: ${(error as Error).message}`);
  }
}

export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        posts: true,
      },
    });
  } catch (error) {
    console.error(
      `Error fetching user by username: ${(error as Error).message}`
    );
    throw new Error(
      `Error fetching user by username: ${(error as Error).message}`
    );
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user by email: ${(error as Error).message}`);
    throw new Error(
      `Error fetching user by email: ${(error as Error).message}`
    );
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
    });
  } catch (error) {
    console.error(`Error searching users: ${(error as Error).message}`);
    throw new Error(`Error searching users: ${(error as Error).message}`);
  }
}

export async function createPost(image: string, caption: string) {
  try {
    const email = await getEmail();
    return (
      await prisma.post.create({
        data: { email, image, caption },
      })
    ).id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post");
  }
}

export async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Error fetching post");
  }
}

export async function searchPosts(q: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { caption: { contains: q, mode: "insensitive" } },
    });
    return await Promise.all(
      posts.map(async (post) => ({
        ...post,
        user: await getUserByEmail(post.email),
      }))
    );
  } catch (error) {
    console.error(`Error searching posts: ${(error as Error).message}`);
    throw new Error(`Error searching posts: ${(error as Error).message}`);
  }
}

export async function createComment(postId: string, comment: string) {
  try {
    const email = await getEmail();
    await prisma.comment.create({
      data: { email, postId, comment },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Error creating comment");
  }
}

export async function getLike(postId: string) {
  try {
    const email = await getEmail();
    return await prisma.like.findUnique({
      where: { email, postId },
    });
  } catch (error) {
    console.error("Error fetching like:", error);
    throw new Error("Error fetching like");
  }
}

export async function updateLike(like: LikeType | null, postId: string) {
  try {
    if (like) {
      await prisma.like.delete({
        where: { id: like.id },
      });
      return null;
    } else {
      const email = await getEmail();
      return await prisma.like.create({
        data: { email, postId },
      });
    }
  } catch (error) {
    console.error("Error updating like:", error);
    throw new Error("Error updating like");
  }
}

export async function getFollow(username: string) {
  try {
    const email = await getEmail();
    return await prisma.follow.findUnique({
      where: { userEmail: email, whoTheyreFollowingUsername: username },
    });
  } catch (error) {
    console.error(`Error fetching follow: ${(error as Error).message}`);
    throw new Error(`Error fetching follow: ${(error as Error).message}`);
  }
}

export async function toggleFollow(
  follow: FollowType | null,
  username: string
) {
  try {
    if (follow) {
      await prisma.follow.delete({
        where: { id: follow.id },
      });
      return null;
    } else {
      const email = await getEmail();
      return await prisma.follow.create({
        data: { userEmail: email, whoTheyreFollowingUsername: username },
      });
    }
  } catch (error) {
    console.error(`Error toggling follow: ${(error as Error).message}`);
    throw new Error(`Error toggling follow: ${(error as Error).message}`);
  }
}

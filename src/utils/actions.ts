"use server";

import { PrismaClient, Like as LikeType } from "@prisma/client";
import { auth, signIn, signOut } from "@/auth";

const prisma = new PrismaClient();

export async function signInAction() {
  await signIn("google");
}

export async function signOutAction() {
  await signOut();
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
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        posts: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
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

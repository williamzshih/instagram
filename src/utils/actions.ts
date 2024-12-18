"use server";

import { prisma } from "@/utils/db";
import { auth } from "@/auth";

export async function updateUser(
  avatar: string,
  username: string,
  name: string,
  bio: string
) {
  const session = await auth();
  await prisma.user.update({
    where: { email: session?.user?.email || "" },
    data: {
      avatar,
      username,
      name,
      bio,
    },
  });
}

export async function getUser() {
  const session = await auth();
  return await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
    include: {
      posts: true,
      comments: true,
    },
  });
}

export async function createPost(image: string, caption: string) {
  const session = await auth();
  return (
    await prisma.post.create({
      data: { image, caption, email: session?.user?.email || "" },
    })
  ).id;
}

export async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function createComment(comment: string, postId: string) {
  const session = await auth();
  await prisma.comment.create({
    data: { comment, postId, email: session?.user?.email || "" },
  });
}

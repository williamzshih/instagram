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

export async function getUser(email?: string) {
  const session = await auth();
  return await prisma.user.findUnique({
    where: { email: email || session?.user?.email || "" },
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

export async function getPosts() {
  const session = await auth();
  return await prisma.post.findMany({
    where: { email: session?.user?.email || "" },
    include: {
      user: true,
      comments: true,
    },
  });
}

export async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      comments: true,
    },
  });
}

export async function createComment(comment: string, postId: string) {
  const session = await auth();
  await prisma.comment.create({
    data: { comment, postId, email: session?.user?.email || "" },
  });
}

export async function getComments(postId: string) {
  return await prisma.comment.findMany({
    where: { postId },
    include: {
      user: true,
      post: true,
    },
  });
}

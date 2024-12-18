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
    where: { email: session?.user?.email ?? "" },
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
    where: { email: session?.user?.email ?? "" },
  });
}

export async function createPost(image: string, caption: string) {
  const session = await auth();
  await prisma.post.create({
    data: { email: session?.user?.email ?? "", image, caption },
  });
}

export async function getPosts() {
  const session = await auth();
  return await prisma.post.findMany({
    where: { email: session?.user?.email ?? "" },
  });
}

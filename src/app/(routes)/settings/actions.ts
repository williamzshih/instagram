"use server";

import { prisma } from "@/db";

export async function updateUser(
  email: string,
  avatar: string,
  username: string,
  name: string,
  bio: string
) {
  await prisma.user.update({
    where: { email },
    data: {
      avatar,
      username,
      name,
      bio,
    },
  });
}

export async function getUser(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
}

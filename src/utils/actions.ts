"use server";

import { prisma } from "@/utils/db";

export async function updateUser(
  email: string,
  username: string,
  name: string,
  bio: string
) {
  await prisma.user.update({
    where: { email },
    data: {
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

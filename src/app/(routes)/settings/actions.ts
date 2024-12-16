"use server";

import { prisma } from "@/db";

export async function updateSettings(
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

import type { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/db";

const CustomPrismaAdapter = (p: PrismaClient): Adapter => {
  const adapter = PrismaAdapter(p);
  return {
    ...adapter,
    async createUser(user) {
      user.username = await generateUsername(user.email, p);
      return adapter.createUser?.(user);
    },
  } as Adapter;
};

const generateUsername = async (
  email: string,
  p: PrismaClient
): Promise<string> => {
  const base = email.split("@")[0].replaceAll(/[^a-zA-Z0-9]/g, "");
  let username = base;
  let counter = 0;
  while (true) {
    const existingUser = await p.user.findUnique({ where: { username } });
    if (!existingUser) return username;
    username = `${base}${counter}`;
    counter++;
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: CustomPrismaAdapter(prisma),
  providers: [Google],
});

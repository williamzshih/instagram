import type { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/prisma";

const CustomPrismaAdapter = (p: PrismaClient): Adapter => {
  const adapter = PrismaAdapter(p);
  return {
    ...adapter,
    async createUser(user) {
      user.username = await generateUsername(user.name, p);
      return adapter.createUser?.(user);
    },
  } as Adapter;
};

const generateUsername = async (
  name: string,
  p: PrismaClient
): Promise<string> => {
  const base = name.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "");
  let username = base;
  let counter = 0;
  while (true) {
    const existingUser = await p.user.findUnique({ where: { username } });
    if (!existingUser) return username;
    username = `${base}${counter}`;
    counter++;
  }
};

const followUser = {
  select: {
    image: true,
    name: true,
    username: true,
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: CustomPrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      const data = await prisma.user.findUnique({
        select: {
          followers: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              createdAt: true,
              follower: followUser,
              id: true,
            },
          },
          following: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              createdAt: true,
              followee: followUser,
              id: true,
            },
          },
        },
        where: { id: user.id },
      });

      user.followers = data?.followers || [];
      user.following = data?.following || [];

      return session;
    },
  },
  providers: [Google],
});

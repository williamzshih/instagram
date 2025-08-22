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

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: CustomPrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      const data = await prisma.user.findUnique({
        select: {
          bookmarks: {
            select: {
              createdAt: true,
              id: true,
              post: {
                select: {
                  id: true,
                  image: true,
                },
              },
            },
          },
          followers: {
            select: {
              createdAt: true,
              follower: {
                select: {
                  image: true,
                  name: true,
                  username: true,
                },
              },
              id: true,
            },
          },
          following: {
            select: {
              createdAt: true,
              followee: {
                select: {
                  image: true,
                  name: true,
                  username: true,
                },
              },
              id: true,
            },
          },
          likes: {
            select: {
              createdAt: true,
              id: true,
              post: {
                select: {
                  id: true,
                  image: true,
                },
              },
            },
          },
          posts: {
            select: {
              createdAt: true,
              id: true,
              image: true,
            },
          },
        },
        where: { id: user.id },
      });

      user.bookmarks = data?.bookmarks || [];
      user.followers = data?.followers || [];
      user.following = data?.following || [];
      user.likes = data?.likes || [];
      user.posts = data?.posts || [];

      return session;
    },
  },
  providers: [Google],
});

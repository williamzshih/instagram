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
  callbacks: {
    async session({ session, user }) {
      const data = await prisma.user.findUnique({
        select: {
          bookmarks: {
            select: {
              post: {
                select: {
                  createdAt: true,
                  id: true,
                  image: true,
                },
              },
            },
          },
          followers: {
            select: {
              realFollower: {
                select: {
                  createdAt: true,
                  id: true,
                  image: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          following: {
            select: {
              realFollowee: {
                select: {
                  createdAt: true,
                  id: true,
                  image: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          likes: {
            select: {
              post: {
                select: {
                  createdAt: true,
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

      session.user.posts = data?.posts || [];
      session.user.likes = data?.likes.map((l) => l.post) || [];
      session.user.bookmarks = data?.bookmarks.map((b) => b.post) || [];

      session.user.followers = data?.followers.map((f) => f.realFollower) || [];
      session.user.following = data?.following.map((f) => f.realFollowee) || [];
      return session;
    },
  },
  providers: [Google],
});

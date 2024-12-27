import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./utils/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        return "/sign-up";
      }

      return "/";
    },
  },
});

"use server";

import { prisma } from "@/db";

export const updateUser = async ({
  data,
  id,
}: {
  data: {
    bio: string;
    image?: null | string;
    name?: null | string;
    username: string;
  };
  id: string;
}) => {
  try {
    await prisma.user.update({ data, where: { id } });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user:", { cause: error });
  }
};

export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user:", { cause: error });
  }
};

export const checkUsername = async (username: string) => {
  try {
    return !(await prisma.user.findUnique({
      where: { username },
    }));
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw new Error("Error checking username availability:", { cause: error });
  }
};

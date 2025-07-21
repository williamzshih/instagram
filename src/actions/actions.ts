"use server";

import { auth } from "@/auth";
import { pinata } from "@/utils/config";

// TODO: check if this is needed elsewhere besides profile.ts
export const getEmail = async () => {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Not signed in");
    return session.user.email;
  } catch (error) {
    console.error("Error fetching email:", error);
    throw new Error("Error fetching email:", { cause: error });
  }
};

export const uploadFile = async (file: File) => {
  try {
    const { cid } = await pinata.upload
      .file(file)
      .group(process.env.PINATA_GROUP_ID || "");
    return `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${cid}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file:", { cause: error });
  }
};

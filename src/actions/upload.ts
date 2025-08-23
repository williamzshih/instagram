"use server";

import { pinata } from "@/pinata";

export const uploadFile = async (file: File) => {
  try {
    const { cid } = await pinata.upload
      .file(file)
      .group(process.env.PINATA_GROUP_ID!);
    return `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${cid}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file:", { cause: error });
  }
};

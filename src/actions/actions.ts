"use server";

import { auth } from "@/auth";
import { pinata } from "@/utils/config";

export async function getEmail() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      console.error("Not signed in:", session);
      throw new Error("Not signed in", { cause: session });
    }
    return session.user.email;
  } catch (error) {
    console.error("Error fetching email:", error);
    throw new Error("Error fetching email", { cause: error });
  }
}

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const uploadData = await pinata.upload
      .file(file)
      .group(process.env.PINATA_GROUP_ID || "");
    return `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${uploadData.cid}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file", { cause: error });
  }
}

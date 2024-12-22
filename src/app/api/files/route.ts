import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload
      .file(file)
      .group(process.env.PINATA_GROUP_ID || "");
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${uploadData.cid}`;
    return NextResponse.json(url, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

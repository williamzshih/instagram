import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getProfile } from "@/actions/profile";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) redirect("/sign-in");
    const profile = await getProfile({ email: session.user.email });

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(profile.username);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

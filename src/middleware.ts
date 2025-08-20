import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(async (req) => {
  const cookie = req.headers.get("cookie");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const response = await fetch(`${req.nextUrl.origin}/api/user`, {
    headers: {
      cookie: cookie,
    },
  });
  const username = await response.json();
  const pathSplit = req.nextUrl.pathname.split("/user/")[1].split("/");
  const pathUsername = pathSplit[0];
  const rest = pathSplit.slice(1).join("/");
  if (username === pathUsername) {
    return NextResponse.redirect(new URL(`/profile/${rest}`, req.nextUrl));
  }
  return NextResponse.next();
});

export const middleware = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  return NextResponse.next();
};

export const config = {
  matcher: "/",
  runtime: "nodejs",
};

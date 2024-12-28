import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  if (req.nextUrl.pathname.startsWith("/user/")) {
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
    const pathUsername = req.nextUrl.pathname.split("/user/")[1];
    if (username === pathUsername) {
      return NextResponse.redirect(new URL("/profile", req.nextUrl));
    }
    return NextResponse.next();
  }
});

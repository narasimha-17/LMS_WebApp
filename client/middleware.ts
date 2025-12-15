import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Decode JWT payload (no verification needed here)
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    // ❌ Block non-admins from admin pages
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      payload.role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/certifications", request.url)
      );
    }

  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

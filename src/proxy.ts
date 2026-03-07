import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log("Middleware - token =============================>", token);

  const { pathname } = req.nextUrl;

  if (!token?._id) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!token.isVerified && pathname !== "/verify-account") {
    return NextResponse.redirect(new URL("/verify-account", req.url));
  }

  // Protect "/" and "/dashboard/*"
  const isProtectedRoute =
    pathname === "/" || pathname.startsWith("/dashboard");

  if (isProtectedRoute && !token?._id) {
    console.log("Middleware - No token found, user is not authenticated");
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

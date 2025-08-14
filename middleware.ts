import { NextRequest, NextResponse } from "next/server";
import { getValidSession } from "./lib/auth/server";

const publicRoute = [
  "/",
  "/sign-in",
  "/sign-up",
  "/welcome",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  const session = await getValidSession();

  if (publicRoute.includes(pathName) && !session) {
    return NextResponse.next();
  }

  if (session && publicRoute.includes(pathName)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!session && !publicRoute.includes(pathName)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|scripts|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|js|css|json)).*)",
  ],
};

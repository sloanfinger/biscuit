import { authenticateToken } from "@/server/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const token = request.nextUrl.searchParams.get("token");

  if (email === null || token === null) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await authenticateToken(email, token);
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login?verify", request.url));
  }
}

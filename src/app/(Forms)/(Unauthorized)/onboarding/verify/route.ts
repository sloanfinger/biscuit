import User from "@/server/models/User";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const token = request.nextUrl.searchParams.get("token");

  if (email === null || token === null) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const result = await User.authenticate({ email, token });

    if (result === null) {
      throw new Error("`null` returned in token authentication.");
    }

    (await cookies()).set(...result.cookie);
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login?verify", request.url));
  }
}

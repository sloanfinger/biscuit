import User from "@/server/models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const token = request.nextUrl.searchParams.get("token");

  if (email === null || token === null) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const user = await User.findOne({ "settings.email": email });

    if (user === null) {
      throw new Error(`User with email ${email} does not exist in database.`);
    }

    const session = await user
      .authenticate({ token })
      .then(() => user.setToken(cookies()));

    return redirect(`/@${session.avatar.username}`);
  } catch (error) {
    console.error(error);
    return redirect("/login?verify");
  }
}

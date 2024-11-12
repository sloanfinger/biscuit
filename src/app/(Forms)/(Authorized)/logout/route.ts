import { deleteSession } from "@/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  deleteSession(await cookies());
  redirect("/");
}

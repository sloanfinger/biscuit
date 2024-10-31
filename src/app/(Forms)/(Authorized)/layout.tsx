import { authorize } from "@/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function Authorized({ children}: PropsWithChildren) {
  const session = await authorize(await cookies()).catch(() => null);

  if (session === null) {
    redirect("/login");
  }

  return <>{children}</>;
}
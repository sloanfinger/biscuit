import SessionProvider from "@/components/Session";
import { authorize } from "@/server/auth";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await authorize().catch((error: unknown) => {
    console.error(error);
    return null;
  });

  if (session === null) {
    redirect("/login");
  }

  return <SessionProvider value={session}>{children}</SessionProvider>;
}

import SessionProvider from "@/components/Session";
import { authorize } from "@/server/auth";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

export default async function UnauthorizedLayout({
  children,
}: PropsWithChildren) {
  const session = await authorize().catch(() => null);

  if (session !== null) {
    redirect(`/@${session.username}`);
  }

  return <SessionProvider value={null}>{children}</SessionProvider>;
}

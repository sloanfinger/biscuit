import User from "@/server/models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function Authorized({ children }: PropsWithChildren) {
  const session = await cookies()
    .then(User.authorize)
    .catch(() => null);

  if (session !== null) {
    redirect(`/@${session.avatar.username}`);
  }

  return <>{children}</>;
}

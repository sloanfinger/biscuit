import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import Back from "./Back";
import User from "@/server/models/User";

export default async function Authorized({ children }: PropsWithChildren) {
  await cookies()
    .then(User.authorize)
    .catch(() => redirect("/login"));

  return (
    <section className="flex max-h-full w-full max-w-2xl flex-col items-center gap-9 overflow-y-auto overflow-x-hidden rounded-lg bg-zinc-900 px-5 py-6 shadow-xl sm:px-8 sm:py-9">
      {children}
      <Back />
    </section>
  );
}

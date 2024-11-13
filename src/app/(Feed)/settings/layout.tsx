import User from "@/server/models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";
import SidebarItem from "./SidebarItem";

export default async function Layout({ children }: PropsWithChildren) {
  await cookies()
    .then(User.authorize)
    .catch(() => redirect("/login"));

  return (
    <main className="relative flex-1 bg-zinc-900 px-12 pb-8 pt-16">
      <div className="mx-auto grid size-full max-w-[1536px] grid-cols-[20rem_auto] grid-rows-[max-content_auto] gap-x-4 gap-y-16 [align-items:start]">
        <h2 className="col-span-2 text-center font-serif text-6xl">Settings</h2>

        <aside className="rounded-lg bg-zinc-950 px-4 py-6">
          <nav className="contents">
            <ul className="flex flex-col divide-y">
              <SidebarItem href="/settings">Account</SidebarItem>
              <SidebarItem href="/settings">Profile</SidebarItem>
            </ul>
          </nav>
        </aside>

        <div className="rounded-lg bg-zinc-950 px-4 py-6">{children}</div>
      </div>
    </main>
  );
}

import Logo from "@/components/Logo";
import * as Menu from "@/components/Menu";
import SessionProvider from "@/components/Session";
import { authorize } from "@/server/auth";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import {
  PiCardsThreeBold,
  PiDiscoBallBold,
  PiPlaylistBold,
  PiShootingStarBold,
} from "react-icons/pi";
import Profile from "./Profile";
import { cookies } from "next/headers";

export default async function Header({ children }: PropsWithChildren) {
  return (
    <SessionProvider value={await authorize(await cookies()).catch(() => null)}>
      <div className="z-0 flex h-full min-h-screen flex-col text-white">
        <div className="z-10 w-full px-4">
          <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 py-6">
            <Logo />

            <Menu.Root className="relative z-0 flex items-center justify-center text-lg font-normal text-white">
              <Menu.Item>
                <Link
                  className="flex items-center gap-2 px-5 py-1 [&>svg]:text-zinc-400 [&>svg]:duration-200 [&>svg]:hover:text-amber-500"
                  href="/releases"
                >
                  <PiCardsThreeBold />
                  Releases
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Link
                  className="flex items-center gap-2 px-5 py-1 [&>svg]:text-zinc-400 [&>svg]:duration-200 [&>svg]:hover:text-amber-500"
                  href="/playlists"
                >
                  <PiPlaylistBold />
                  Playlists
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Link
                  className="flex items-center gap-2 px-5 py-1 [&>svg]:text-zinc-400 [&>svg]:duration-200 [&>svg]:hover:text-amber-500"
                  href="/community"
                >
                  <PiDiscoBallBold />
                  Community
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Link
                  className="flex items-center gap-2 px-5 py-1 [&>svg]:text-zinc-400 [&>svg]:duration-200 [&>svg]:hover:text-amber-500"
                  href="/pro"
                >
                  <PiShootingStarBold />
                  Pro
                </Link>
              </Menu.Item>
            </Menu.Root>

            <Profile />
          </nav>
        </div>

        {children}
      </div>
    </SessionProvider>
  );
}

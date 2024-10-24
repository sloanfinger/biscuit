import { authorize } from "@/server/auth";
import Link from "next/link";
import {
  PiCardsThreeBold,
  PiDiscoBallBold,
  PiPlaylistBold,
  PiShootingStarBold,
  PiSignInBold,
} from "react-icons/pi";
import Logo from "../../components/Logo";
import { type PropsWithChildren } from "react";

export default async function Header({ children }: PropsWithChildren) {
  const user = await authorize().catch(() => null);

  return (
    <div className="z-0 flex h-full min-h-screen flex-col text-white">
      <div className="group z-10 w-full px-4">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 py-6">
          <Logo />

          <ul className="flex flex-1 items-center justify-center gap-10 text-lg font-normal text-white">
            <li className="contents">
              <Link
                className="flex items-center gap-2 bg-underline"
                href="/releases"
              >
                <PiCardsThreeBold className="text-zinc-400" />
                Releases
              </Link>
            </li>

            <li className="contents">
              <Link
                className="flex items-center gap-2 bg-underline"
                href="/playlists"
              >
                <PiPlaylistBold className="text-zinc-400" />
                Playlists
              </Link>
            </li>

            <li className="contents">
              <Link
                className="flex items-center gap-2 bg-underline"
                href="/community"
              >
                <PiDiscoBallBold className="text-zinc-400" />
                Community
              </Link>
            </li>

            <li className="contents">
              <Link
                className="flex items-center gap-2 bg-underline"
                href="/community"
              >
                <PiShootingStarBold className="text-zinc-400" />
                Pro
              </Link>
            </li>
          </ul>

          {user ? (
            <div>@{user.username}</div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md border-2 border-green-800 bg-gradient-to-b from-green-400 to-green-500 px-6 py-2 text-zinc-950"
            >
              Sign In
              <PiSignInBold />
            </Link>
          )}
        </nav>
      </div>

      {children}
    </div>
  );
}

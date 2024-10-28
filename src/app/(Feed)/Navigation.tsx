"use client";

import Logo from "@/components/Logo";
import { useProfile } from "@/components/Session";
import { signOut } from "@/server/actions";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import {
  type ComponentProps,
  type MouseEvent,
  type MouseEventHandler,
  type PropsWithChildren,
  useCallback,
  useRef,
} from "react";
import {
  PiCardsThreeBold,
  PiDiscoBallBold,
  PiDoorOpenBold,
  PiFileDashedBold,
  PiGearBold,
  PiPlaylistBold,
  PiQueueBold,
  PiShootingStarBold,
  PiSignInBold,
  PiUsersBold,
} from "react-icons/pi";

interface NavbarItemProps extends PropsWithChildren {
  href: ComponentProps<typeof Link>["href"];
  onMouseEnter: MouseEventHandler;
}

function NavItem({ children, href, onMouseEnter }: NavbarItemProps) {
  return (
    <li className="contents">
      <Link
        className="flex items-center gap-2 px-5 py-1 [&>svg]:text-zinc-400 [&>svg]:duration-200 [&>svg]:hover:text-amber-500"
        onMouseEnter={onMouseEnter}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

function Profile() {
  const user = useProfile();

  if (user === null) {
    return (
      <Link
        className="box-content flex items-center gap-2 rounded-md border-2 border-green-800 bg-gradient-to-b from-green-400 to-green-500 px-6 py-2 text-zinc-950"
        href="/login"
      >
        Sign In
        <PiSignInBold />
      </Link>
    );
  }

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Avatar.Root className="relative block size-11">
          {/* <Avatar.Image /> */}
          <Avatar.Fallback className="block h-full w-full rounded-full border-2 border-green-950 bg-gradient-to-br from-green-700 to-green-900 py-1.5 text-center font-serif text-[1.75rem] leading-none text-white opacity-90">
            {user.username.substring(0, 2).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          className="min-w-56 divide-y-2 divide-zinc-950 overflow-hidden rounded-lg border-2 border-zinc-950 bg-gradient-to-b from-zinc-800 to-zinc-900 text-white shadow-xl focus-within:outline-none"
          sideOffset={4}
          align="end"
          side="bottom"
        >
          <Dropdown.Label className="w-full cursor-default bg-zinc-900 py-1.5 text-center text-sm font-bold text-zinc-400">
            @{user.username}
          </Dropdown.Label>
          <Dropdown.Group className="py-1.5">
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href={`/@${user.username}/following`}
              >
                <PiUsersBold className="text-zinc-400" />
                Following
              </Link>
            </Dropdown.Item>
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href={`/@${user.username}/queue`}
              >
                <PiQueueBold className="text-zinc-400" />
                Music Queue
              </Link>
            </Dropdown.Item>
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href={`/@${user.username}/drafts`}
              >
                <PiFileDashedBold className="text-zinc-400" />
                Drafts
              </Link>
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Group className="py-1.5">
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href="/settings"
              >
                <PiGearBold className="text-zinc-400" />
                Settings
              </Link>
            </Dropdown.Item>

            <Dropdown.Item asChild>
              <button
                className="flex w-full items-center gap-2 px-4 py-1.5 text-red-500 hover:bg-red-800/25"
                onClick={() => void signOut()}
              >
                <PiDoorOpenBold />
                Sign Out
              </button>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

export default function Navigation() {
  const shadowRef = useRef<HTMLSpanElement>(null);

  const handleItemMouseEnter = useCallback((e: MouseEvent) => {
    if (shadowRef.current === null) {
      return;
    }

    const shadow = shadowRef.current;
    const targetBounds = e.currentTarget.getBoundingClientRect();

    shadow.style.opacity = "1";
    shadow.style.top = targetBounds.y.toString() + "px";
    shadow.style.left = targetBounds.x.toString() + "px";
    shadow.style.width = targetBounds.width.toString() + "px";
    shadow.style.height = targetBounds.height.toString() + "px";

    window.requestAnimationFrame(() => {
      shadow.style.transitionProperty = "opacity,width,height,top,left";
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (shadowRef.current === null) {
      return;
    }

    const shadow = shadowRef.current;
    shadow.style.opacity = "0";
    shadow.style.transitionProperty = "opacity";
  }, []);

  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 py-6">
      <Logo />

      <span
        className="fixed -z-10 block rounded-md bg-amber-500/20 duration-200 will-change-[top,left,width,height,opacity]"
        ref={shadowRef}
      />

      <ul
        className="relative flex items-center justify-center text-lg font-normal text-white"
        onMouseLeave={handleMouseLeave}
      >
        <NavItem href="/releases" onMouseEnter={handleItemMouseEnter}>
          <PiCardsThreeBold />
          Releases
        </NavItem>

        <NavItem href="/playlists" onMouseEnter={handleItemMouseEnter}>
          <PiPlaylistBold />
          Playlists
        </NavItem>

        <NavItem href="/community" onMouseEnter={handleItemMouseEnter}>
          <PiDiscoBallBold />
          Community
        </NavItem>

        <NavItem href="/pro" onMouseEnter={handleItemMouseEnter}>
          <PiShootingStarBold />
          Pro
        </NavItem>
      </ul>

      <Profile />
    </nav>
  );
}

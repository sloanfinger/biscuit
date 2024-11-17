"use client";

import { signOut } from "@/server/actions/users";
import { Token } from "@/server/models/User";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import {
  PiDoorOpenBold,
  PiFileDashedBold,
  PiGearBold,
  PiPencilSimpleLineBold,
  PiQueueBold,
  PiSignInBold,
  PiUserCircleBold,
} from "react-icons/pi";

interface Props {
  user: Token | null;
}

export default function Profile({ user }: Props) {
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
            {user.avatar.displayName.substring(0, 2).toUpperCase()}
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
            @{user.avatar.username}
          </Dropdown.Label>
          <Dropdown.Group className="py-1.5">
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href="new"
              >
                <PiPencilSimpleLineBold className="text-zinc-400" />
                Create Review
              </Link>
            </Dropdown.Item>
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href={`/@${user.avatar.username}/queue`}
              >
                <PiQueueBold className="text-zinc-400" />
                Music Queue
              </Link>
            </Dropdown.Item>
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href={`/@${user.avatar.username}`}
              >
                <PiUserCircleBold className="text-zinc-400" />
                Profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item asChild>
              <Link
                className="flex w-full items-center gap-2 px-4 py-1.5 hover:bg-black/40"
                href={`/@${user.avatar.username}/drafts`}
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

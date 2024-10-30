import * as Menu from "@/components/Menu";
import { authorize } from "@/server/auth";
import connect from "@/server/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PiFileDashedBold,
  PiGearDuotone,
  PiMapPinFill,
  PiPencilSimpleLineBold,
} from "react-icons/pi";
import SubNavItem from "./SubNavItem";

async function getProfile(params: Props["params"]) {
  const tag = decodeURIComponent((await params).profile);

  if (!tag.startsWith("@")) {
    notFound();
  }

  const { from } = await connect();
  const user = await from("users")
    .findOne({
      "profile.username": tag.substring(1),
    })
    .catch(() => null);

  if (user === null) {
    notFound();
  }

  return user.profile;
}

interface Props {
  params: Promise<{ profile: string }>;
}

export default async function Profile({ params }: Props) {
  const session = await authorize().catch(() => null);
  const profile = await getProfile(params);

  return (
    <>
      <header className="relative z-0 mx-auto -mt-[5.75rem] flex h-[40rem] w-full max-w-[1600px] flex-col items-center justify-end py-8">
        <Image
          alt=""
          className="absolute top-0 -z-10 size-full object-cover"
          height={720}
          width={1280}
          src="https://picsum.photos/seed/3/1280/720"
        />

        <div className="absolute inset-0 -z-10 size-full bg-gradient-to-b from-zinc-950/60 to-zinc-950" />

        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-12">
          <figure className="relative aspect-square h-20 overflow-hidden rounded-full">
            <Image
              alt=""
              className="absolute top-0 size-full object-cover"
              height={128}
              width={128}
              src="https://picsum.photos/128/128"
            />
          </figure>

          <div className="flex flex-1 flex-col justify-center gap-1 pr-4">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="flex items-center gap-1.5 pb-1 text-sm leading-tight text-green-500">
              <PiMapPinFill /> Athens, GA
            </p>
            <p className="text-sm italic leading-tight text-zinc-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              maxime saepe, harum culpa minus est praesentium excepturi vero
              ullam.
            </p>
          </div>

          <Menu.Root className="flex flex-row">
            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${profile.username}/albums`}
              >
                <span className="font-serif text-3xl font-bold">1,234</span>
                <span className="text-xs font-bold uppercase text-zinc-500 group-hover:text-amber-400">
                  Albums
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${profile.username}/artists`}
              >
                <span className="font-serif text-3xl font-bold">1,234</span>
                <span className="text-xs font-bold uppercase text-zinc-500 group-hover:text-amber-400">
                  Artists
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${profile.username}/followers`}
              >
                <span className="font-serif text-3xl font-bold">1,234</span>
                <span className="text-xs font-bold uppercase text-zinc-500 group-hover:text-amber-400">
                  Followers
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${profile.username}/following`}
              >
                <span className="font-serif text-3xl font-bold">1,234</span>
                <span className="text-xs font-bold uppercase text-zinc-500 group-hover:text-amber-400">
                  Following
                </span>
              </Link>
            </Menu.Item>
          </Menu.Root>
        </div>
      </header>

      <main className="flex flex-col gap-8 px-4">
        <aside className="-mx-4 w-screen border-y-2 border-zinc-600 bg-zinc-900 px-4 py-1 text-zinc-400">
          <nav className="contents">
            <Menu.Root className="relative z-0 mx-auto flex max-w-5xl items-center justify-center">
              <SubNavItem path="" profile={profile}>
                Profile
              </SubNavItem>
              <SubNavItem path="/reviews" profile={profile}>
                Reviews
              </SubNavItem>
              <SubNavItem path="/albums" profile={profile}>
                Albums
              </SubNavItem>
              <SubNavItem path="/artists" profile={profile}>
                Artists
              </SubNavItem>
              <SubNavItem path="/playlists" profile={profile}>
                Playlists
              </SubNavItem>
              <SubNavItem path="/queue" profile={profile}>
                Queue
              </SubNavItem>
              <SubNavItem path="/stats" profile={profile}>
                Stats
              </SubNavItem>
            </Menu.Root>
          </nav>
        </aside>

        {session?.username === profile.username && (
          <nav className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 rounded-lg border-2 border-dashed border-green-600 px-6 py-4">
            <p className="flex-1 text-lg font-bold text-zinc-400">
              Welcome to your profile. This is only visible to you.
            </p>
            <p className="flex gap-2">
              <Link
                className="group flex flex-col items-center gap-1 rounded-md border-2 border-zinc-500 bg-gradient-to-b from-zinc-900 to-zinc-950 px-6 py-3 hover:border-green-500 hover:from-green-900 hover:to-green-950 active:bg-gradient-to-t"
                href="/new"
              >
                <PiPencilSimpleLineBold className="text-2xl text-zinc-400 group-hover:text-white" />
                Log New Music
              </Link>
              <Link
                className="group flex flex-col items-center gap-1 rounded-md border-2 border-zinc-500 bg-gradient-to-b from-zinc-900 to-zinc-950 px-6 py-3 hover:border-green-500 hover:from-green-900 hover:to-green-950 active:bg-gradient-to-t"
                href={`/@${profile.username}/drafts`}
              >
                <PiFileDashedBold className="text-2xl text-zinc-400 group-hover:text-white" />
                Edit Drafts
              </Link>
              <Link
                className="group flex flex-col items-center gap-1 rounded-md border-2 border-zinc-500 bg-gradient-to-b from-zinc-900 to-zinc-950 px-6 py-3 hover:border-green-500 hover:from-green-900 hover:to-green-950 active:bg-gradient-to-t"
                href="/settings/profile"
              >
                <PiGearDuotone className="text-2xl text-zinc-400 group-hover:text-white" />
                Profile Settings
              </Link>
            </p>
          </nav>
        )}

        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-t-lg bg-zinc-800 px-12 py-8">
          {/* <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
            New Releases
            <PiRssBold className="-mb-0.5 -ml-0.5" />
            <span className="h-[3px] flex-1 bg-current opacity-50" />
          </h2> */}
        </section>
      </main>
    </>
  );
}

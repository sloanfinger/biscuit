import * as Menu from "@/components/Menu";
import Reviews from "@/components/Reviews";
import connection from "@/server/models";
import User from "@/server/models/User";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PiFileDashedBold,
  PiGearDuotone,
  PiMapPinFill,
  PiPencilSimpleLineBold,
  PiRssBold,
} from "react-icons/pi";
import SubNavItem from "./SubNavItem";

async function getUser(params: Props["params"]) {
  const tag = decodeURIComponent((await params).profile);

  if (!tag.startsWith("@")) {
    notFound();
  }

  await connection;
  const user = await User.findOne({
    "profile.avatar.username": tag.substring(1),
  }).catch(() => null);

  if (user === null) {
    notFound();
  }

  return user;
}

interface Props {
  params: Promise<{ profile: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const nf = new Intl.NumberFormat("en-US");
  const user = await getUser(params);
  const isBioEmpty: boolean = user.profile.bio === "";
  const session = await cookies()
    .then(User.authorize)
    .catch(() => null);

  return (
    <>
      <header className="relative z-0 mx-auto -mt-[5.75rem] flex h-[40rem] w-full max-w-[1600px] flex-col items-center justify-end py-8">
        <Image
          alt=""
          className="absolute top-0 -z-10 size-full object-cover"
          height={720}
          width={1280}
          src={user.profile.profileBanner}
        />

        <div className="absolute inset-0 -z-10 size-full bg-gradient-to-b from-zinc-950/60 to-zinc-950" />

        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-12">
          <figure className="relative aspect-square h-20 overflow-hidden rounded-full">
            <Image
              alt=""
              className="absolute top-0 size-full object-cover"
              height={128}
              width={128}
              src={user.profile.avatar.image ?? "https://picsum.photos/128/128"}
            />
          </figure>

          <div className="flex flex-1 flex-col justify-center gap-1 pr-4">
            <h2 className="text-xl font-bold">
              {user.profile.avatar.username}
            </h2>
            <p className="flex items-center gap-1.5 pb-1 text-sm leading-tight text-green-500">
              <PiMapPinFill /> Athens, GA
            </p>
            {!isBioEmpty && (
              <p className="text-sm italic leading-tight text-zinc-400">
                {user.profile.bio}
              </p>
            )}
          </div>

          <Menu.Root className="flex flex-row">
            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${user.profile.avatar.username}/albums`}
              >
                <span className="font-serif text-3xl font-bold">
                  {nf.format(user.profile.stats.releases)}
                </span>
                <span className="text-xs font-bold uppercase text-zinc-500 group-hover:text-amber-400">
                  Albums
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${user.profile.avatar.username}/artists`}
              >
                <span className="font-serif text-3xl font-bold">
                  {nf.format(user.profile.stats.artists)}
                </span>
                <span className="text-xs font-bold uppercase text-zinc-500 group-hover:text-amber-400">
                  Artists
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${user.profile.avatar.username}/followers`}
              >
                <span className="font-serif text-3xl font-bold">
                  {nf.format(user.profile.stats.followers)}
                </span>
                <span className="text-xs font-bold uppercase text-zinc-500 group-hover:text-amber-400">
                  Followers
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                className="group flex flex-col items-center justify-center px-2 py-1"
                href={`/@${user.profile.avatar.username}/following`}
              >
                <span className="font-serif text-3xl font-bold">
                  {nf.format(user.profile.stats.following)}
                </span>
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
              <SubNavItem path="" username={user.profile.avatar.username}>
                Profile
              </SubNavItem>
              <SubNavItem
                  path="/reviews"
                  username={user.profile.avatar.username}
              >
                Reviews
              </SubNavItem>
              <SubNavItem
                  path="/albums"
                  username={user.profile.avatar.username}
              >
                Albums
              </SubNavItem>
              <SubNavItem
                  path="/artists"
                  username={user.profile.avatar.username}
              >
                Artists
              </SubNavItem>
              <SubNavItem
                  path="/playlists"
                  username={user.profile.avatar.username}
              >
                Playlists
              </SubNavItem>
              <SubNavItem path="/queue" username={user.profile.avatar.username}>
                Queue
              </SubNavItem>
              <SubNavItem path="/stats" username={user.profile.avatar.username}>
                Stats
              </SubNavItem>
            </Menu.Root>
          </nav>
        </aside>

        {session?.avatar.username === user.profile.avatar.username && (
            <nav
                className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 rounded-lg border-2 border-dashed border-green-600 px-6 py-4">
              <p className="flex-1 text-lg font-bold text-zinc-400">
                Welcome to your profile.
              </p>
              <p className="flex gap-2">
                <Link
                    className="group flex flex-col items-center gap-1 rounded-md border-2 border-zinc-500 bg-gradient-to-b from-zinc-900 to-zinc-950 px-6 py-3 hover:border-green-500 hover:from-green-900 hover:to-green-950 active:bg-gradient-to-t"
                    href="/new"
                >
                  <PiPencilSimpleLineBold className="text-2xl text-zinc-400 group-hover:text-white"/>
                  Log New Music
                </Link>
                <Link
                    className="group flex flex-col items-center gap-1 rounded-md border-2 border-zinc-500 bg-gradient-to-b from-zinc-900 to-zinc-950 px-6 py-3 hover:border-green-500 hover:from-green-900 hover:to-green-950 active:bg-gradient-to-t"
                    href={`/@${user.profile.avatar.username}/drafts`}
                >
                  <PiFileDashedBold className="text-2xl text-zinc-400 group-hover:text-white"/>
                  Edit Drafts
                </Link>
                <Link
                    className="group flex flex-col items-center gap-1 rounded-md border-2 border-zinc-500 bg-gradient-to-b from-zinc-900 to-zinc-950 px-6 py-3 hover:border-green-500 hover:from-green-900 hover:to-green-950 active:bg-gradient-to-t"
                    href="/settings/profile"
                >
                  <PiGearDuotone className="text-2xl text-zinc-400 group-hover:text-white"/>
                  Profile Settings
                </Link>
              </p>
            </nav>
        )}

        <section>
          <div className="mx-auto grid w-full max-w-6xl md:grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-8 rounded-lg bg-zinc-900 px-24 py-8">
            <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
              Recent Reviews
              <PiRssBold className="-mb-0.5 -ml-0.5"/>
              <span className="h-[3px] flex-1 bg-current opacity-50"/>
            </h2>

            <Reviews author={user._id.toHexString()} limit={6} sortBy="recent"/>
          </div>
        </section>
        <section>
          <style>
            {`
            .reviews-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8x;
            backgrou}`}
          </style>
          <div className="mx-auto grid w-full max-w-6xl md:grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-8 rounded-lg bg-zinc-900 px-24 py-8">
            <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
              Popular Reviews
              <PiRssBold className="-mb-0.5 -ml-0.5"/>
              <span className="h-[3px] flex-1 bg-current opacity-50"/>
            </h2>

            <Reviews author={user._id.toHexString()} limit={6} sortBy="popular"/>
          </div>
        </section>
      </main>
    </>
  );
}

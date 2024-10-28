import Image from "next/image";
import Link from "next/link";
import {
  PiArrowRightBold,
  PiCaretDownBold,
  PiHeartFill,
  PiMagnifyingGlassBold,
  PiTrendUpBold
} from "react-icons/pi";

export default function Releases() {
  const playlists = new Array(9).fill(null);
  const releases = new Array(7).fill(null);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 pb-3 text-white *:rounded-lg *:bg-zinc-900">
      <form className="flex flex-col gap-4 px-24 pb-8 pt-32">
        <h2 className="font-serif text-7xl">Playlists</h2>

        <label className="relative block">
          <input
            className="peer w-full rounded-md border-2 border-zinc-700 bg-transparent py-4 pl-[3.25rem] text-xl placeholder:text-zinc-500 focus:border-green-600 focus:outline-none"
            placeholder="Genres, Vibes, Must-Listens..."
            type="text"
            name="search"
          />
          <span className="absolute left-0 top-0 flex h-full items-center pl-5 pr-4 text-xl text-zinc-400 peer-focus:text-green-600">
            <PiMagnifyingGlassBold />
          </span>
        </label>

        <button
          className="-mt-2 flex items-center gap-2 self-end rounded-md px-3 py-1 text-amber-400/80 transition-colors hover:bg-amber-500/10"
          type="button"
        >
          Advanced Filters <PiCaretDownBold />
        </button>
      </form>

      <section className="grid grid-cols-3 grid-rows-[repeat(2,max-content_repeat(3,1fr)_max-content)] gap-x-4 gap-y-8 px-24 py-8">
        <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
          Trending Now
          <PiTrendUpBold className="-mb-0.5 -ml-0.5" />
          <span className="h-[3px] flex-1 bg-current opacity-50" />
        </h2>

        {playlists.map((_, i) => (
          <article
            className="flex flex-col items-center gap-4 rounded-md bg-zinc-800 p-2"
            key={i}
          >
            <figure className="pointer-events-none relative grid w-full grid-cols-[8rem_repeat(6,1fr)] grid-rows-1">
              {releases.map((_, i) => (
                <span
                  className="relative z-0 block [&>span]:first:hidden"
                  key={i}
                >
                  <Image
                    alt=""
                    className="place-items aspect-square h-full object-cover object-right"
                    height={128}
                    src={`https://picsum.photos/seed/${String(i + 1)}/128/128`}
                    width={128}
                  />
                  <span className="absolute inset-0 z-10 h-full w-full bg-gradient-to-r from-black/75 to-black/25" />
                </span>
              ))}
            </figure>

            <Link
              className="text-center text-lg font-bold bg-underline"
              href="/@username/list/1234567890"
            >
              Playlist Name
            </Link>

            <Link
              href="/@username"
              className="-mt-2 w-full rounded-md px-2 py-1 hover:bg-zinc-700"
            >
              <figure className="flex w-full items-center justify-between gap-2 pr-2">
                <span className="relative block size-4 overflow-hidden rounded-full">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    src="https://picsum.photos/64/64"
                  />
                </span>
                <figcaption className="contents text-sm text-zinc-400">
                  username
                  <span className="flex flex-1 items-center justify-end gap-2 text-rose-400">
                    <PiHeartFill /> 1,234 likes
                  </span>
                </figcaption>
              </figure>
            </Link>
          </article>
        ))}

        <div className="col-span-full -mt-4 flex items-end justify-end">
          <Link
            className="flex items-center gap-2 text-lg bg-underline"
            href="/"
          >
            View More <PiArrowRightBold />
          </Link>
        </div>
      </section>
    </main>
  );
}

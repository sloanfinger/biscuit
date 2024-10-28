import Image from "next/image";
import Link from "next/link";
import {
  PiArrowRightBold,
  PiCaretDownBold,
  PiHeartFill,
  PiMagnifyingGlassBold,
  PiRssBold,
  PiStar,
  PiStarFill,
  PiStarHalfFill,
  PiTrendUpBold,
} from "react-icons/pi";

export default function Releases() {
  const releases = new Array(6).fill(null);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 pb-3 text-white *:rounded-lg *:bg-zinc-900">
      <form className="flex flex-col gap-4 px-24 pb-8 pt-32">
        <h2 className="font-serif text-7xl">Releases</h2>

        <label className="relative block">
          <input
            className="peer w-full rounded-md border-2 border-zinc-700 bg-transparent py-4 pl-[3.25rem] text-xl placeholder:text-zinc-500 focus:border-green-600 focus:outline-none"
            placeholder="Albums, Singles, Artists..."
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

      <section className="grid grid-cols-2 grid-rows-[repeat(2,max-content_repeat(3,1fr)_max-content)] gap-x-4 gap-y-8 px-24 py-8">
        <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
          Trending Now
          <PiTrendUpBold className="-mb-0.5 -ml-0.5" />
          <span className="h-[3px] flex-1 bg-current opacity-50" />
        </h2>

        {releases.map((_, i) => (
          <article
            className="flex gap-4 rounded-md bg-zinc-800 p-2 shadow-sm"
            key={i}
          >
            <figure className="relative aspect-square h-full min-h-32 overflow-hidden rounded-md">
              <Image
                alt=""
                className="object-cover"
                fill
                src="https://picsum.photos/256/256"
              />
            </figure>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl">
                <Link
                  className="font-bold bg-underline"
                  href="/release/1234567890"
                >
                  Album Title
                </Link>{" "}
                <Link
                  className="text-zinc-400 bg-underline"
                  href="/artist/1234567890"
                >
                  Artist Name
                </Link>
              </h3>

              <Link
                className="group flex flex-1 flex-col gap-1 rounded-r-md border-l-[3px] border-zinc-600 px-2 pb-0.5 hover:bg-zinc-700"
                href="/@username/release/1234567890"
              >
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </Link>

              <Link
                href="/@username"
                className="-my-1 rounded-md px-2 py-1 hover:bg-zinc-700"
              >
                <figure className="flex items-center gap-2 pr-2">
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

              <figure className="flex flex-col gap-1 text-green-500">
                <span className="flex items-center gap-0.5 text-lg">
                  <PiStarFill />
                  <PiStarFill />
                  <PiStarFill />
                  <PiStarHalfFill />
                  <PiStar />
                </span>
                <figcaption className="flex-1 cursor-default pb-0.5 text-xs">
                  avg. 3.49 / 5
                </figcaption>
              </figure>
            </div>
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

        <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
          New Releases
          <PiRssBold className="-mb-0.5 -ml-0.5" />
          <span className="h-[3px] flex-1 bg-current opacity-50" />
        </h2>

        {releases.map((_, i) => (
          <article
            className="flex gap-4 rounded-md bg-zinc-800 p-2 shadow-sm"
            key={i}
          >
            <figure className="relative aspect-square h-full min-h-32 overflow-hidden rounded-md">
              <Image
                alt=""
                className="object-cover"
                fill
                src="https://picsum.photos/256/256"
              />
            </figure>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl">
                <Link
                  className="font-bold bg-underline"
                  href="/release/1234567890"
                >
                  Album Title
                </Link>{" "}
                <Link
                  className="text-zinc-400 bg-underline"
                  href="/artist/1234567890"
                >
                  Artist Name
                </Link>
              </h3>

              <Link
                className="group flex flex-1 flex-col gap-1 rounded-r-md border-l-[3px] border-zinc-600 px-2 pb-0.5 hover:bg-zinc-700"
                href="/@username/release/1234567890"
              >
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </Link>

              <Link
                href="/@username"
                className="-my-1 rounded-md px-2 py-1 hover:bg-zinc-700"
              >
                <figure className="flex items-center gap-2 pr-2">
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

              <figure className="flex flex-col gap-1 text-green-500">
                <span className="flex items-center gap-0.5 text-lg">
                  <PiStarFill />
                  <PiStarFill />
                  <PiStarFill />
                  <PiStarHalfFill />
                  <PiStar />
                </span>
                <figcaption className="flex-1 cursor-default pb-0.5 text-xs">
                  avg. 3.49 / 5
                </figcaption>
              </figure>
            </div>
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

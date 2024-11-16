"use client";

import Expandable from "@/components/Expandable";
import SearchResult from "@/components/SearchResult";
import { useToast } from "@/components/Toast";
import useSearch from "@/hooks/useSearch";
import { search } from "@/server/actions/itunes";
import { useEffect } from "react";
import {
  PiCaretDownBold,
  PiCircleNotchBold,
  PiMagnifyingGlassBold,
  PiWarningBold,
} from "react-icons/pi";

export default function Search() {
  const { publish } = useToast();
  const { isPending, success, error, handleChange } = useSearch(search, {
    country: "US",
    entity: "album",
    media: "music",
    limit: "12",
  });

  useEffect(() => {
    if (error !== null) {
      publish({
        className: "bg-red-300 border-red-800 text-red-950",
        icon: PiWarningBold,
        message: error,
      });
    }
  }, [error]);

  return (
    <>
      <section className="flex flex-col gap-4 rounded-lg bg-zinc-900 px-24 pb-8 pt-32">
        <h2 className="font-serif text-7xl">Releases</h2>

        <label className="relative block">
          <input
            className="peer w-full rounded-md border-2 border-zinc-700 bg-transparent py-4 pl-[3.25rem] text-xl placeholder:text-zinc-500 focus:border-green-600 focus:outline-none"
            name="search"
            onChange={handleChange}
            placeholder="Albums, Singles, Artists..."
            type="text"
          />
          <span className="absolute left-0 top-0 flex h-full items-center pl-5 pr-4 text-xl text-zinc-400 peer-focus:text-green-600">
            <PiMagnifyingGlassBold />
          </span>
          <span
            className={`absolute bottom-0 right-0 flex h-full flex-col justify-center px-4 text-xl text-zinc-400 transition-opacity duration-75 ${isPending ? "opacity-100" : "opacity-0"}`}
          >
            <PiCircleNotchBold className="animate-spin [animation-duration:500ms]" />
          </span>
        </label>

        <button
          className="-mt-2 flex items-center gap-2 self-end rounded-md px-3 py-1 text-amber-400/80 transition-colors hover:bg-amber-500/10"
          type="button"
        >
          Advanced Filters <PiCaretDownBold />
        </button>
      </section>

      <section className="-mt-3">
        <Expandable control={success.length > 0}>
          <article className="pt-3">
            <ul className="rounded-lg bg-zinc-900 px-24 py-8">
              <ul className="grid grid-cols-6 gap-x-2 gap-y-1.5">
                {success.map((release) => (
                  <li className="contents" key={release.collectionId}>
                    <SearchResult href="/releases" release={release} />
                  </li>
                ))}
              </ul>
            </ul>
          </article>
        </Expandable>
      </section>
    </>
  );
}

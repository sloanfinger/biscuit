"use client";

import { useToast } from "@/components/Toast";
import useSearch from "@/hooks/useSearch";
import { itunes } from "@/server/actions/search";
import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { useEffect } from "react";
import {
  PiArrowLeftBold,
  PiCircleNotchBold,
  PiFloppyDiskBackBold,
  PiMagnifyingGlassBold,
  PiWarningBold,
} from "react-icons/pi";

export default function New() {
  const { publish } = useToast();
  const { isPending, success, error, handleChange } = useSearch(itunes, {
    country: "US",
    entity: "album",
    media: "music",
    limit: "8",
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
    <section className="flex max-h-full w-full max-w-2xl flex-col items-center gap-9 overflow-y-auto overflow-x-hidden rounded-lg bg-zinc-900 px-5 py-6 shadow-xl sm:px-8 sm:py-9">
      <h2 className="text-3xl font-bold text-white">Log Listening Session</h2>

      <fieldset className="items-cente flex w-full gap-3">
        <label className="relative block w-full flex-1 space-y-1.5">
          <input
            className="peer form-input w-full rounded-md border-2 border-zinc-500 bg-transparent px-12 text-white placeholder:text-zinc-500 focus:border-amber-400 focus:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-80"
            name="search"
            onChange={handleChange}
            placeholder="Search"
            required
            type="text"
          />
          <span className="absolute bottom-0 flex flex-col justify-center px-4 pb-2.5 text-2xl text-zinc-500 opacity-60 peer-focus:text-amber-400">
            <PiMagnifyingGlassBold />
          </span>
          <span
            className={`absolute bottom-0 right-0 flex flex-col justify-center px-4 pb-3 text-xl text-zinc-400 transition-opacity duration-75 ${isPending ? "opacity-100" : "opacity-0"}`}
          >
            <PiCircleNotchBold className="animate-spin [animation-duration:500ms]" />
          </span>
        </label>

        <label className="relative block space-y-1.5">
          <select className="form-select rounded-md border-2 bg-transparent text-white">
            <option value="release">Albums</option>
            <option value="artist">Artists</option>
            <option value="artist">Songs</option>
          </select>
        </label>
      </fieldset>

      <Accordion.Root
        type="single"
        value={success.length > 0 ? "default" : undefined}
      >
        <Accordion.Item value="default">
          <Accordion.Content asChild>
            <article className="overflow-hidden text-white data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
              <ul className="grid grid-cols-4 gap-x-2 gap-y-1.5">
                {success.map((album) => (
                  <li className="contents" key={album.collectionId}>
                    <Link
                      className="relative flex flex-col gap-4 rounded-md px-3 py-3.5 transition-[box-shadow,background-color] duration-100 hover:bg-zinc-800 hover:shadow-md active:shadow-sm"
                      href={`/new/album/i:${album.collectionId.toString()}`}
                    >
                      <figure className="contents">
                        <img
                          alt=""
                          className="aspect-square h-auto w-full rounded-sm object-cover"
                          src={album.artworkUrl100.replace(
                            "100x100",
                            "256x256",
                          )}
                        />
                        <figcaption className="flex flex-col gap-1 leading-tight">
                          <span className="block">{album.collectionName}</span>
                          <span className="block text-sm text-zinc-400">
                            {album.artistName}
                          </span>
                        </figcaption>
                      </figure>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <p className="-mb-2 flex w-full flex-col-reverse items-center justify-between text-zinc-400 sm:flex-row">
        <button
          className="flex items-center justify-center gap-2 bg-underline"
          type="button"
        >
          <PiArrowLeftBold />
          Go Back
        </button>
        <button
          className="hidden items-center justify-center gap-2 bg-underline"
          type="button"
        >
          <PiFloppyDiskBackBold />
          Save to Drafts
        </button>
      </p>
    </section>
  );
}

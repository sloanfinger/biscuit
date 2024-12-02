"use client";

import SearchResult from "@/components/SearchResult";
import { useToast } from "@/components/Toast";
import useSearch from "@/hooks/useSearch";
import { search } from "@/server/actions/itunes";
import * as Accordion from "@radix-ui/react-accordion";
import { useEffect } from "react";
import {
  PiCircleNotchBold,
  PiMagnifyingGlassBold,
  PiWarningBold,
} from "react-icons/pi";

export default function New() {
  const { publish } = useToast();
  const { isPending, success, error, handleChange } = useSearch(search, {
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
    <>
      <h2 className="text-base md:text-lg lg:text-xl font-bold text-white">Create Album Review</h2>

      <fieldset className="flex justify-center w-full gap-3">
        <label className="prelative block mx-auto w-full flex-1 space-y-1.5">
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
      </fieldset>

      <Accordion.Root
        type="single"
        value={success.length > 0 ? "default" : undefined}
      >
        <Accordion.Item value="default">
          <Accordion.Content asChild>
            <article className="overflow-hidden text-white data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
              <ul className="grid grid-cols-4 gap-x-2 gap-y-1.5">
                {success.map((release) => (
                  <li className="contents" key={release.collectionId}>
                    <SearchResult href="/edit" release={release} />
                  </li>
                ))}
              </ul>
            </article>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
}

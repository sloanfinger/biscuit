import { Release } from "@/server/actions/itunes";
import Link from "next/link";
import Image from "next/image";

interface Props {
  href: string;
  release: Release;
}

export default function SearchResult({ href, release }: Props) {
  return (
    <Link
      className="relative flex flex-col gap-4 rounded-md px-3 py-3.5 transition-[box-shadow,background-color] duration-100 hover:bg-zinc-800 h-max hover:shadow-md active:shadow-sm"
      href={href + "/" + release.collectionId}
    >
      <figure className="contents">
        <span className="relative aspect-square h-auto w-full overflow-hidden rounded-sm">
          {release.artworkUrl100 && (
            <Image
              alt=""
              className="absolute inset-0 size-full object-cover"
              src={release.artworkUrl100.replace("100x100", "256x256")}
              height={112}
              width={112}
            />
          )}
        </span>
        <figcaption className="flex flex-col gap-1">
          <span className="text-lg font-bold leading-tight line-clamp-2">
            {release.collectionName}
          </span>
          <span className="leading-tight text-zinc-400 line-clamp-2">
            {release.artistName}
          </span>
        </figcaption>
      </figure>
    </Link>
  );
}

import { lookup } from "@/server/actions/itunes";
import type { Collections } from "@/server/db";
import Image from "next/image";
import Link from "next/link";
import {
  PiChatCircleFill,
  PiHeartFill,
  PiStar,
  PiStarFill,
  PiStarHalfFill,
} from "react-icons/pi";
import ReveiwToolbar from "./ReviewToolbar";

export type ReviewDoc = Omit<Collections["reviews"], "ownerId"> & {
  ownerAvatar: Collections["users"]["profile"]["avatar"];
};

function Rating({ amount }: { amount: number }) {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i + 0.5 === amount) {
      stars.push(<PiStarHalfFill />);
    } else if (i < amount) {
      stars.push(<PiStarFill />);
    } else {
      stars.push(<PiStar />);
    }
  }

  return stars;
}

interface Props {
  review: ReviewDoc;
  entity: "album";
}

export default async function Review({ review, entity }: Props) {
  const nf = new Intl.NumberFormat("en-US");
  const result = await lookup(Number(review.releaseId.split(":")[1]), {
    limit: "1",
    entity,
  });

  if (result.error !== undefined || result.success.length < 1) {
    console.error(result.error);
    throw new Error(result.error);
  }

  const release = result.success[0];

  return (
    <article className="grid grid-cols-[8rem_auto] grid-rows-[8rem_auto] items-center gap-x-6 gap-y-3 rounded-md bg-zinc-800 px-4 py-3 shadow-sm">
      <figure className="contents">
        <Image
          alt=""
          className="size-32 rounded-sm object-cover"
          src={release.artworkUrl100.replace("100x100", "256x256")}
          height={128}
          width={128}
        />
        <figcaption className="row-start-2 flex flex-col items-start">
          <Link
            className="text-xl font-bold bg-underline"
            href={`/releases/${review.releaseId}`}
          >
            {release.collectionName}
          </Link>{" "}
          <Link
            className="-mt-1 mb-1 text-zinc-400 bg-underline"
            href={`/artists/${review.artistId}`}
          >
            {release.artistName}
          </Link>
        </figcaption>
      </figure>

      <div className="flex h-full flex-1 flex-col gap-3">
        <Link
          className="contents"
          href={`/@${review.ownerAvatar.username}/releases/${review.releaseId}`}
        >
          {review.content ? (
            <span className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-r-md border-l-[3px] border-zinc-600 bg-current px-3 pt-0.5 text-zinc-800 transition-colors hover:text-zinc-700">
              <span className="max-h-full text-white">{review.content}</span>
              <span className="absolute bottom-0 h-5 w-full bg-gradient-to-b from-transparent to-current" />
            </span>
          ) : (
            <figure className="flex flex-1 flex-col items-center justify-center gap-1 rounded-sm border-2 border-zinc-600 bg-zinc-900/50 text-green-500 transition-colors hover:border-green-600 hover:bg-zinc-900">
              <span className="flex items-center gap-1 text-3xl">
                <Rating amount={review.rating} />
              </span>
              <figcaption className="pb-0.5 text-sm">
                {review.rating.toFixed(1)} / 5.0
              </figcaption>
            </figure>
          )}
        </Link>

        <div className="flex items-center justify-between">
          <Link
            href={`/@${review.ownerAvatar.username}`}
            className="-mx-1.5 -my-1 rounded-md px-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            <figure className="flex items-center gap-2 pr-2">
              <span className="relative block size-4 overflow-hidden rounded-full">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  src={
                    review.ownerAvatar.image ?? "https://picsum.photos/64/64"
                  }
                />
              </span>
              <figcaption className="contents text-sm">
                {review.ownerAvatar.displayName}
              </figcaption>
            </figure>
          </Link>

          <ReveiwToolbar
            releaseId={review.releaseId}
            username={review.ownerAvatar.username}
          />
        </div>
      </div>

      <div className="flex cursor-default justify-between">
        <figure className="flex flex-col text-sm">
          <span className="flex items-center gap-2 text-rose-400">
            <PiHeartFill /> {nf.format(review.likeCount)} likes
          </span>
          <span className="flex items-center gap-2 text-orange-400">
            <PiChatCircleFill /> {nf.format(review.commentCount)} comments
          </span>
        </figure>

        {review.content && (
          <figure className="flex flex-col items-end justify-center gap-1 text-green-500">
            <span className="flex items-center gap-0.5 text-lg">
              <Rating amount={review.rating} />
            </span>
            <figcaption className="pb-0.5 text-xs">
              {review.rating.toFixed(1)} / 5.0
            </figcaption>
          </figure>
        )}
      </div>
    </article>
  );
}

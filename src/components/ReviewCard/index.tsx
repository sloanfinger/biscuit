import { lookup } from "@/server/actions/itunes";
import { getLikeStatus } from "@/server/actions/likes";
import { Populate } from "@/server/models";
import Review from "@/server/models/Review";
import User from "@/server/models/User";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  PiChatCircleBold,
  PiPencilSimple,
  PiStar,
  PiStarFill,
  PiStarHalfFill
} from "react-icons/pi";
import LikeButton from "./LikeButton";

export type PopulatedReview = Populate<
  typeof Review,
  typeof User,
  ["author", "profile", "avatar"]
>;

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
  review: PopulatedReview;
  entity: "album";
}

export default async function ReviewCard({ review, entity }: Props) {
  const nf = new Intl.NumberFormat("en-US");
  const result = await lookup(review.releaseId, {
    limit: "1",
    entity,
  });

  if (result.error !== undefined || result.success.length < 1) {
    console.error(result.error);
    throw new Error(result.error);
  }

  const release = result.success[0];
  const session = await cookies()
    .then(User.authorize)
    .catch(() => null);

  const hasLiked = await getLikeStatus(review._id.toHexString())
    .then((result) => "success" in result && result.success.status)
    .catch(() => false);

  return (
    <article className="grid grid-cols-[8rem_auto] grid-rows-[8rem_auto] items-center gap-x-6 gap-y-3 rounded-md bg-zinc-800 px-4 py-3 shadow-sm">
      <figure className="contents">
        <span className="relative size-32 overflow-hidden rounded-sm">
          {release.artworkUrl100 && (
            <Image
              alt=""
              className="absolute inset-0 size-full object-cover"
              src={release.artworkUrl100.replace("100x100", "256x256")}
              height={128}
              width={128}
            />
          )}
        </span>
        <figcaption className="row-start-2 flex flex-col items-start gap-2 self-start">
          <Link
            className="line-clamp-2 text-xl font-bold leading-tight hover:underline"
            href={`/releases/${review.releaseId}`}
          >
            {release.collectionName}
          </Link>{" "}
          <Link
            className="-mt-1 mb-1 line-clamp-2 leading-tight text-zinc-400 hover:underline"
            href={`/artists/${review.artistId}`}
          >
            {release.artistName}
          </Link>
        </figcaption>
      </figure>

      <Link
        className="flex h-full flex-1 flex-col"
        href={`/@${review.author.profile.avatar.username}/releases/${review.releaseId}`}
      >
        {review.content ? (
          <span className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-r-md border-l-[3px] border-zinc-600 bg-current px-3 pt-0.5 text-zinc-800 transition-colors hover:text-zinc-700">
            <span className="line-clamp-4 max-h-full text-white">
              {review.content}
            </span>
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

      <div className="flex h-full min-h-20 flex-col justify-around">
        <div className="flex items-center justify-between">
          <Link
            href={`/@${review.author.profile.avatar.username}`}
            className="-mx-1.5 -my-1 rounded-md px-1.5 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            <figure className="flex items-center gap-2 pr-2">
              <span className="relative block size-5 overflow-hidden rounded-full">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  src={
                    review.author.profile.avatar.image ??
                    "https://picsum.photos/64/64"
                  }
                />
              </span>
              <figcaption className="contents">
                {review.author.profile.avatar.displayName}
              </figcaption>
            </figure>
          </Link>

          {session &&
            session.avatar.username ===
              review.author.profile.avatar.username && (
              <div className="flex gap-1.5">
                <Link
                  className="rounded-md border border-yellow-400/50 bg-yellow-700/25 p-0.5 text-yellow-400 hover:border-yellow-400"
                  href={`/edit/${review.releaseId}`}
                >
                  <PiPencilSimple />
                  <span className="sr-only">Edit Review</span>
                </Link>

                {/* <Transition
                  action={deleteReview}
                  binding={{ releaseId: review.releaseId }}
                  revalidate="page"
                  className="rounded-md border border-red-400/50 bg-red-700/25 p-0.5 text-red-400 hover:border-red-400"
                  title="Delete Review"
                  type="button"
                >
                  <PiTrash />
                </Transition> */}
              </div>
            )}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col text-sm">
            <LikeButton
              initialState={{
                hasLiked,
                likeCount: review.likeCount,
              }}
              reviewId={review._id.toHexString()}
            />

            <Link
              className="flex items-center gap-2 rounded-md px-1 text-orange-400 hover:bg-orange-700/25"
              href={`/@${review.author.profile.avatar.username}/release/${review.releaseId}`}
            >
              <PiChatCircleBold /> {nf.format(review.commentCount)} comments
            </Link>
          </div>

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
      </div>
    </article>
  );
}

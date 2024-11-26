"use client";

import useActionResult from "@/hooks/useActionResult";
import { toggleLike } from "@/server/actions/likes";
import {
  deleteReview,
  type GetReviewsParams,
  type ReviewProps,
} from "@/server/actions/reviews";
import { Token } from "@/server/models/User";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import {
  PiChatCircleBold,
  PiHeartBold,
  PiHeartFill,
  PiPencilSimple,
  PiStar,
  PiStarFill,
  PiStarHalfFill,
  PiTrash,
} from "react-icons/pi";

function Rating({ amount }: { amount: number }) {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i + 0.5 === amount) {
      stars.push(<PiStarHalfFill key={i} />);
    } else if (i < amount) {
      stars.push(<PiStarFill key={i} />);
    } else {
      stars.push(<PiStar key={i} />);
    }
  }

  return stars;
}

interface ReviewCardProps extends ReviewProps {
  onDelete: (releaseId: string) => void;
  session: Token | null;
}

function ReviewCard({
  review,
  release,
  hasLiked,
  onDelete,
  session,
}: ReviewCardProps) {
  const nf = new Intl.NumberFormat("en-US");
  const [state, trigger] = useActionResult(
    toggleLike,
    {
      hasLiked,
      likeCount: review.likeCount,
    },
    ({ hasLiked, likeCount }) => ({
      hasLiked: !hasLiked,
      likeCount: likeCount + (hasLiked ? -1 : 1),
    }),
  );

  return (
    <div className="@container">
      <article className="flex grid-cols-[8rem_auto] grid-rows-[8rem_auto] flex-col gap-[1.125rem] gap-x-6 rounded-md bg-zinc-800 px-2 py-1.5 shadow-sm @[16rem]:px-4 @[16rem]:py-[1.125rem] @md:grid @md:items-center @md:gap-y-3">
        <figure className="flex flex-col items-center gap-4 @[16rem]:flex-row @md:contents">
          <span className="relative aspect-square w-full overflow-hidden rounded-sm @[16rem]:size-20 @md:size-32">
            {release.artworkUrl100 && (
              <Image
                alt=""
                className="absolute inset-0 size-full object-cover"
                src={release.artworkUrl100.replace("100x100", "256x256")}
                height={256}
                width={256}
              />
            )}
          </span>
          <figcaption className="row-start-2 flex flex-col items-center gap-2 @[16rem]:items-start @md:self-start">
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
            <span className="flex-1 flex flex-col justify-center overflow-hidden rounded-r-md border-l-[3px] border-zinc-600 px-3 py-0.5 text-sm text-white transition-colors hover:bg-zinc-700 @[16rem]:pb-0 @[16rem]:text-base">
              <span className="line-clamp-4">
                {review.content}
              </span>
            </span>
          ) : (
            <figure className="flex flex-1 flex-col items-center justify-center gap-1 rounded-sm border-2 border-zinc-600 bg-zinc-900/50 py-3 text-green-500 transition-colors hover:border-green-600 hover:bg-zinc-900">
              <span className="flex items-center gap-1 text-2xl @[16rem]:text-3xl">
                <Rating amount={review.rating} />
              </span>
              <figcaption className="pb-0.5 text-sm">
                {review.rating.toFixed(1)} / 5.0
              </figcaption>
            </figure>
          )}
        </Link>

        <div className="flex h-full flex-col gap-3 @md:min-h-20 @md:justify-around @md:gap-0">
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

                  <button
                    className="rounded-md border border-red-400/50 bg-red-700/25 p-0.5 text-red-400 hover:border-red-400"
                    onClick={() => {
                      onDelete(review.releaseId);
                    }}
                    title="Delete Review"
                    type="button"
                  >
                    <PiTrash />
                  </button>
                </div>
              )}
          </div>
          <div className="flex flex-col-reverse items-center gap-3 @[16rem]:flex-row @[16rem]:justify-between">
            <div className="flex flex-col items-center text-sm @[16rem]:items-start">
              <button
                className="flex items-center gap-2 rounded-md px-1 text-rose-400 hover:bg-rose-700/25"
                onClick={() => {
                  trigger(review._id);
                }}
              >
                {state.hasLiked ? <PiHeartFill /> : <PiHeartBold />}{" "}
                {nf.format(state.likeCount)} likes
              </button>

              <Link
                className="flex items-center gap-2 rounded-md px-1 text-orange-400 hover:bg-orange-700/25"
                href={`/@${review.author.profile.avatar.username}/release/${review.releaseId}`}
              >
                <PiChatCircleBold /> {nf.format(review.commentCount)} comments
              </Link>
            </div>

            {review.content && (
              <figure className="flex flex-col items-center justify-center gap-1 text-green-500 @[16rem]:items-end">
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
    </div>
  );
}

interface Props {
  params: GetReviewsParams;
  reviews: ReviewProps[];
  session: Token | null;
}

export default function ReviewCollection({ params, reviews, session }: Props) {
  const [state, trigger] = useActionResult(
    deleteReview,
    reviews,
    (prevState, releaseId) =>
      prevState.filter(
        ({ review }) =>
          review.releaseId !== releaseId ||
          review.author.profile.avatar.username !== session?.avatar.username,
      ),
  );

  const handleDelete = useCallback(
    (releaseId: string) => {
      trigger(releaseId, params);
    },
    [params],
  );

  return state.map((props) => (
    <ReviewCard
      key={props.review._id}
      onDelete={handleDelete}
      session={session}
      {...props}
    />
  ));
}

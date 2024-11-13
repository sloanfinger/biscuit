import ReviewCard, { type ReviewDoc } from "@/components/Review";
import Link from "next/link";
import { PiArrowRightBold, PiTrendUpBold } from "react-icons/pi";
import Search from "./Search";
import Review from "@/server/models/Review";
import connection from "@/server/models";

async function getRecentReviews() {
  const recentReviews: ReviewDoc[] = [];

  await connection;

  const cursor = Review.aggregate<ReviewDoc>([
    {
      $match: {
        isDraft: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerRelation",
      },
    },
    {
      $set: {
        ownerRelation: { $first: "$ownerRelation" },
      },
    },
    {
      $set: {
        ownerAvatar: "$ownerRelation.profile.avatar",
      },
    },
    {
      $unset: ["_id", "owner", "ownerRelation"],
    },
  ])
    .sort({ timestamp: -1 })
    .limit(6);

  for await (const doc of cursor) {
    recentReviews.push(doc);
  }

  return recentReviews;
}

export default async function Releases() {
  const recentReviews = await getRecentReviews();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 px-4 pb-3 text-white">
      <Search />

      <section className="grid grid-cols-2 grid-rows-[repeat(2,max-content_repeat(3,1fr)_max-content)] gap-x-4 gap-y-8 rounded-lg bg-zinc-900 px-24 py-8">
        <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
          Trending Now
          <PiTrendUpBold className="-mb-0.5 -ml-0.5" />
          <span className="h-[3px] flex-1 bg-current opacity-50" />
        </h2>

        {recentReviews.map((_, i) => (
          <ReviewCard
            entity="album"
            key={`${recentReviews[i].releaseId}:${recentReviews[i].ownerAvatar.username}`}
            review={recentReviews[i]}
          />
        ))}

        <div className="col-span-full -mt-4 flex items-end justify-end">
          <Link
            className="flex items-center gap-2 text-lg bg-underline"
            href="/"
          >
            View More <PiArrowRightBold />
          </Link>
        </div>

        {/* <h2 className="col-span-full flex items-center gap-3 font-bold uppercase text-amber-400">
          New Releases
          <PiRssBold className="-mb-0.5 -ml-0.5" />
          <span className="h-[3px] flex-1 bg-current opacity-50" />
        </h2>

        <div className="col-span-full -mt-4 flex items-end justify-end">
          <Link
            className="flex items-center gap-2 text-lg bg-underline"
            href="/"
          >
            View More <PiArrowRightBold />
          </Link>
        </div> */}
      </section>
    </main>
  );
}

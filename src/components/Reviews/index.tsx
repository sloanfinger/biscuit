import { getReviews, type GetReviewsParams } from "@/server/actions/reviews";
import User from "@/server/models/User";
import { cookies } from "next/headers";
import ReviewCollection from "./ReviewCollection";

export default async function Reviews(props: GetReviewsParams) {
  const [result, session] = await Promise.all([
    getReviews(props),
    cookies()
      .then(User.authorize)
      .catch(() => null),
  ]);

  if ("error" in result) {
    return null;
  }

  return (
    <ReviewCollection
      params={props}
      reviews={result.success}
      session={session}
    />
  );
}

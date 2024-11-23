import {cookies} from "next/headers";
import User from "@/server/models/User";
import {redirect} from "next/navigation"
import {
  deleteReview,
  type GetReviewsParams,
  type ReviewProps,
} from "@/server/actions/reviews";
import {getReviews} from "@/server/actions/reviews";
import ReviewCollection from "@/components/Reviews/ReviewCollection";

/*
* Workaround for the return of getUserReviews being void,
*  as otherwise userReviews when typed to ReviewProps[] will
* mention how ReviewProp does not have a success or error members.
 */
export interface Outcome<T> {
    success?: T;
    error?: string;
}

export default async function ReviewsPage () {
    const user = await cookies()
        .then(User.authorize)
        .catch(() => redirect("/login"));
    const getUserReviews = async () => {
        try {
            const userReviews: Outcome<ReviewProps[]> = await getReviews({ limit: 100, sortBy: "recent", author: user.id });
            if (!userReviews) {
                return <div>This user currently has no reviews posted.</div>
            }
            if (userReviews.success) return userReviews.success;
            else return [];
        } catch (e) {
            console.log(e);
            throw new Error("An unexpected error has occurred.");
        }
    };
    const reviews100 = await getUserReviews();
    console.log("reviews100", reviews100);
    console.log(user);
    return (
        <ReviewCollection params={{sortBy: "recent", limit: 100, author: user.id}} reviews={reviews100} session={user}/>
    );
}

import Reviews from '@/components/Reviews/index';
import ReviewCard from '@/components/Reviews/ReviewCollection';
import {cookies} from "next/headers";
import User from "@/server/models/User";
import {redirect} from "next/navigation";
import {
  deleteReview,
  type GetReviewsParams,
  type ReviewProps,
} from "@/server/actions/reviews";
import {getReviews} from "@/server/actions/reviews";
import { undefined } from "zod";
import user from "@/server/models/User";


export default function ReviewsPage () {
            const getUserReviews = async () => {
              try {
                //Will be done twice
                const user = await cookies()
                  .then(User.authorize)
                  .catch(() => redirect("/login"));
                console.log(user); //DELETE Later
                const userReviews = await getReviews({ limit: 100, sortBy: "recent", author: user.id });
                console.log(userReviews); //DELETE Later
                //const docReviews = userReviews;
                //displayReviews({reviews: docReviews, error: null});
              } catch (e) {
                console.log(e);
                throw new Error("An unexpected error has occurred.");
                //redirect("/login"); //change to another place later, other strings are giving me errors
              }
            };
        }
//}

/*
function displayReviews(ReviewCardProps) {
    return (
        <div>
            {error && <p>{error}</p>}
            <h1>{reviews.length > 0
                ? `${reviews[0].ownerAvatar.username}'s reviews:`
                : "No Reviews Found. Please try again later."}
            </h1>
            {reviews.length > 0 ? (
                reviews.map((review: ReviewDoc) => (
                    <ReviewCard review={review} entity={"album"} />
                ))
            ) : (
                <p>No Reviews Found</p>
            )}
        </div>
    );
}
*/
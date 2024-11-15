import {getUserReviews} from "@/server/actions/reviews";
import ReviewCard, {ReviewDoc} from '@/components/ReviewCard'
import {cookies} from "next/headers";
import User from "@/server/models/User";
import {redirect} from "next/navigation"

interface Props {
   reviews: ReviewDoc[];
   error: string | null;
}


export default function ReviewsPage () {
    //const [reviews, setReviews] = useState<ReviewDoc[]>([]);
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);
    //useEffect(() => {
            const getReviews = async () => {
                //setLoading(true);
                //setError(null);
                try {
                    const user = await cookies()
                        .then(User.authorize)
                        .catch(() => redirect("/login"));
                    const userReviews = await getUserReviews(user.id);
                    const docReviews = userReviews as unknown as ReviewDoc[];
                    displayReviews({reviews: docReviews, error: null});
                    } catch (e) {
                    console.log(e);
                    throw new Error("An unexpected error has occurred.");
                    //redirect("/login"); //change to another place later, other strings are giving me errors
                };
            }
            const reviews = getReviews();
        }
    //);
//}

function displayReviews({reviews, error}: Props) {
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


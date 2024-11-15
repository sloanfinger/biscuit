import {useEffect, useState} from 'react';
import {getUserReviews} from "@/server/actions/reviews";
import {getUser} from "@/app/(Feed)/[profile]/page"
import ReviewCard, {ReviewDoc} from '@/components/ReviewCard'
import {cookies} from "next/headers";
import User from "@/server/models/User";
import {redirect} from "next/navigation";

interface Props {
    params: Promise<{ profile: string }>;
}


const ReviewsPage = ()  => {
    const [reviews, setReviews] = useState<ReviewDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(async () => {
            setLoading(true);
            setError(null);
            try {
                const user = await cookies()
                    .then(User.authorize)
                    .catch(() => redirect("/login"));
                const userReviews = await getUserReviews(user.id);
                displayReviews(user,userReviews);
            } catch (e) {
                console.log(e);
                throw new Error("An unexpected error has occurred.");
            }
        }
    );
}

function displayReviews(user: User, userReviews) {
    return (
        <div>
            <h1>{userReviews.length > 0 ? `{user.avatar.username}'s Reviews:` : "No Reviews Found. Please try again later."}</h1>
            {userReviews.length > 0 ? (
                userReviews.map(review => {
                        <ReviewCard review={review} entity={"album"}/>
                    }
                )) : (
                <p>No Review's Found</p>
            )}
        </div>
    );
}
import Profile from '../../Profile'
import React from 'react'
import {Outcome} from '@/app/(Feed)/[profile]/reviews/page';
import {cookies} from "next/headers";
import User from "@/server/models/User";
import {redirect} from "next/navigation";
import {getReviews, ReviewProps} from "@/server/actions/reviews";
import ReviewCollection from "@/components/Reviews/ReviewCollection";

interface AlbumProps {
    reviews: ReviewProps[];
}

export default async function Albums() {
    const user = await cookies()
        .then(User.authorize)
        .catch(() => redirect("/login"));
    const getUserAlbums = async () => {
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
    const reviews100 = await getUserAlbums();
    console.log("reviews100", reviews100);
    console.log(user);
    return (
        <ReviewCollection params={{sortBy: "recent", limit: 100, author: user.id}} reviews={reviews100} session={user}/>
    );

}

function AlbumCollection(AlbumProps) {

}
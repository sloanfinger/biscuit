import Profile from '../../Profile'
import React from 'react'
import {Outcome} from '@/app/(Feed)/[profile]/reviews/page';
import {cookies} from "next/headers";
import User from "@/server/models/User";
import {redirect} from "next/navigation";
import {getReviews, ReviewProps} from "@/server/actions/reviews";
import ReviewCollection from "@/components/Reviews/ReviewCollection";
import AlbumCollection, {AlbumCards} from "@/components/AlbumCollection";
import {AlbumCollectionProps} from "@/components/AlbumCollection";

interface AlbumProps {
    reviews: ReviewProps[];
}

export default async function Albums() {
    const user = await cookies()
        .then(User.authorize)
        .catch(() => redirect("/login"));
    const getUserAlbums = async () => {
        try {
            const userAlbums: Outcome<ReviewProps[]> = await getReviews({ limit: 100, sortBy: "recent", author: user.id });
            if (!userAlbums) {
                return <div>This user currently has no reviews posted.</div>
            }
            if (userAlbums.success) return userAlbums.success;
            else return [];
        } catch (e) {
            console.log(e);
            throw new Error("An unexpected error has occurred.");
        }
    };
    const reviews100 = await getUserAlbums();
    const releases = reviews100.map((review: ReviewProps) => {
        return review.release
    });
    console.log(releases);
    console.log(user);
    return (
        <AlbumCards params={{sortBy: "recent", limit: 100, author: user.id}} releases={releases} session={user}/>
    );

}

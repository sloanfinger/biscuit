'use client';
import React from 'react';
import Image from 'next/image';
import Link from  'next/link';
import {GetReviewsParams, ReviewProps} from "@/server/actions/reviews";
import { Token } from "@/server/models/User";

export interface AlbumCollectionProps {
    reviews: ReviewProps[];
}

export interface releaseCollectionProp {
    releases: releaseProp[];
    params: GetReviewsParams;
    session: Token | null;
}

export interface releaseProp {
        wrapperType: string,
        collectionExplicitness: string,
        artistId: string,
        collectionId: string,
        collectionName: string,
        collectionCensoredName: string,
        artistName: string,
        artworkUrl100: string,
        collectionType: string,
        primaryGenreName: string,
        releaseDate: string,
        trackCount: number,
}
export function AlbumCards({params, session, releases}: releaseCollectionProp) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
            {releases.map((release: releaseProp) => (
                <div key={release.collectionId} className={"flex flex-col items-center rounded-lg bg-zinc-800 p-4 shadow-md w-3/4"}>
                    <span className="relative aspect-square w-full overflow-hidden rounded-lg">
                        {release.artworkUrl100 && (
                            <Image
                                alt={release.collectionName}
                                className={"absolute inset-0 w-full h-full object-cover"}
                                src={release.artworkUrl100.replace("100x100", "128x128")}
                                height={128}
                                width={128}
                                />
                        )}
                    </span>
                    <div className="mt-2 text-center">
                        <Link href={`/releases/${release.collectionName}`} className={"text-lg font-semibold hover:underline"}>
                            {release.collectionName}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{release.artistName}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

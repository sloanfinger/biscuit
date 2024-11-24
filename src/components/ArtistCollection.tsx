import React from 'react';

export interface Artist {
    artistId: string;
    artistName: string;
    collectionName: string;
}

interface OneArtist {
    artistName: string;
    collectionNames: string[];
}

interface ArtistCollectionProps {
    artists: Artist[];
}

export default async function ArtistCollection(props: ArtistCollectionProps) {
    const artistMap = new Map<string, {artistName: string; collectionNames: string[]}>();
    props.artists.forEach(artist => {
        if (artistMap.has(artist.artistId)) {
            artistMap.get(artist.artistId)?.collectionNames.push(artist.collectionName);
        } else {
            artistMap.set(artist.artistId, {
                artistName: artist.artistName,
                collectionNames: [artist.collectionName],
            });
        }
    });
    const artistSummary = Array.from(artistMap.values());
    console.log(artistSummary);
    return(
        <div className={"p-6"}>
            <h2 className={"text-2xl text-center font-bold text-lg mb-8"}>Artists</h2>
            <div className={"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4 shadow-lg rounded-lg bg-white"}>
                {artistSummary.map((artist) => (
                <ArtistCard artistName={artist.artistName} collectionNames={artist.collectionNames}/>
                ))}
            </div>
        </div>
    )
}

async function ArtistCard(artist: OneArtist) {
    const uniqueKey = `${artist.collectionNames[0]}-${Date.now()}`;
    return(
            <div key={uniqueKey} className={"flex flex-col items-center rounded-lg bg-zinc-800 p-4 shadow-md"}>
                <div className={"mt-2 text-center"}>
                    <p className="text-sm font-bold text-white">{artist.artistName}</p>
                    {artist.collectionNames.map((collectionName: String, index: number) => (
                    <p className="mt-1 text-sm text-gray-500 indent-4">{collectionName}</p>
                    ))}
                </div>
            </div>
    )
}

export function addArtistSongs(artists: Artist[]) {
    const artistMapping: { [key: string]: string[] } = {};
    artists.forEach(artist => {
        if(!artistMapping[artist.artistId]) {
            artistMapping[artist.artistId] = [];
        }
        artistMapping[artist.artistId].push(artist.artistId);
    });
    return artistMapping;
}



'use client'
import React from 'react';
import Playlist from "@/components/Playlist";
import PlaylistName from '@/components/PlaylistName';
import {Album, PlaylistItem} from "@/components/Playlist";

const Page = () => {
    const [playlists, setPlaylists] = React.useState<PlaylistItem[]>([]);
    const [showForm, setShowForm] = React.useState(false);

    const addPlaylist = (name: string) => {
        setPlaylists((prev) => [...prev, {playlist: [], name: name}]);
    };
    const removePlaylist = (name: string) => {
        setPlaylists((prev) => prev.filter((i) => i.name !== name))
    };
    const displayForm = () => {
        setShowForm((prev => !prev));
    };
    return (
        <div>
            <h1 className={"text-2xl font-bold"}>My Playlists</h1>
            <button onClick={displayForm} className={"bg-blue-500 text-white p-2 rounded"}>
                {showForm ? 'Cancel' : 'Create New Playlist'}
            </button>
            {showForm && (<PlaylistName onSubmit={addPlaylist} onClose={displayForm}/>)}
            <div className={"playlists"}>
                {playlists.map((playlist) => (
                    <div key={playlist.name}>
                        <Playlist
                            playlist={playlist.playlist}
                            name={playlist.name}
                            onDelete={() => removePlaylist(playlist.name)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Page;
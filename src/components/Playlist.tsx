import React, {useState} from 'react';
import playlistProps from '@/app/(Feed)/playlists/page'
import useSearch from '@/hooks/useSearch';
import {Result} from '@/server/actions';

export interface Album {
    collectionId: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
}

export interface PlaylistItem {
    playlist: Album[];
    name: string;
    onDelete?: () => void;
}

interface PlaylistCollection {
    playlists: PlaylistItem[];
}

const searchSongs = async (query: string): Promise<Result<Album[]>> => {
    return {success: []};
}


const Playlist = ({playlist, name, onDelete}: PlaylistItem) => {
    const [currPlaylist, setPlaylist] = React.useState<Album[]>([]);
    const [playlists, setPlaylists] = React.useState<PlaylistCollection>({playlists: []});
    const [newTitle, setNewTitle] = useState('');
    const [newArtist, setNewArtist] = useState('');
    const [displayForm, setDisplayForm] = React.useState(false);
    const [playlistName, setPlaylistName] = React.useState('');

    const addToPlaylists = () => {
        const newPlaylist: PlaylistItem = {
            playlist: currPlaylist,
            name: playlistName,
        };
        setPlaylists(prev => ({
            playlists: [...prev.playlists, newPlaylist],
        }));
        setPlaylists({playlists: []});
        setPlaylistName('');
    };
    const handleAddAlbum = (album: Album) => {
        setPlaylist(prev => [...prev, album]);
    }
    return (
        <div className="playlist">
            <h2 className={"text-2xl font-bold"}>My Playlists</h2>
            <div className={"add-album"}>
                <input type="text" placeholder={"Playlist Name"} value={playlistName}
                       onChange={(e) => setPlaylistName(e.target.value)} required/>
                <button onClick={addToPlaylists}>Create Playlist</button>
            </div>
            <ul className="albums">
                {playlists.playlists.map((playlist, index) => (
                    <li key={index} className={"flex justify-between"}>
                        <span>{playlist.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Playlist;

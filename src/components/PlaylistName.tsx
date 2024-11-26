import React from "react";
import {useState} from "react";

interface PlaylistFormProps {
    onSubmit: (name: string) => void;
    onClose: () => void;
}

const PlaylistName: React.FC<PlaylistFormProps> = ({onSubmit, onClose}) => {
    const [name, setName] = React.useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            onSubmit(name);
            setName('');
            onClose();
        }
    };
    return (
        <div className={"playlistName"} style={{padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '9px'}}>
            <div className={"playlistName-content"}>
                <span className={"close"} onClick={onClose}>&times;</span>
                <h2>Create New Playlist</h2>
                <form onSubmit={handleSubmit}>
                    <input type={"text"} placeholder={"Playlist Name"} value={name} onChange={(e) => setName(e.target.value)} required style={{marginRight:'12px'}}/>
                    <button type={"submit"}>Submit</button>
                </form>
            </div>
        </div>
    );
};
export default PlaylistName;

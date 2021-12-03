import React, { useContext, useEffect, useState } from 'react'
import { TiDelete } from 'react-icons/ti';
import { GlobalContext } from '../context/GlobalState'
import axios from 'axios';

const Share = ({ setifSharing }) => {
    // zavolani prihlaseneho usera
    const {user} = useContext(GlobalContext);

    // promenna pro ulozeni dat pratel
    const [allFriends, setAllFriends] = useState([]);

    useEffect(() => {
        // nacteni vsech pratel
        const loadAllUsersFriends = async () => {
            const friends = await axios.get(`/users/getAllFriends/${user._id}`);
            setAllFriends(friends.data);
            console.log(friends.data);
        }
        loadAllUsersFriends();
    }, [user._id]);
    return (
        <div className="Share">
            <div className="shareContainer">
                {
                    allFriends?.map((friends) => (              
                            <span>{friends.username}</span>
                    ))
                }
                <TiDelete className="scaled removeImgShow" onClick={() => setifSharing(ifSharing => !ifSharing)} />
            </div>
        </div>
    )
}

export default Share

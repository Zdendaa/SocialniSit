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
        const loadAllUsersFriends = async () => {
            const friends = await axios.get(`users/getAllFriends/${user._id}`);
            setAllFriends(friends.data);
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
            </div>
            <TiDelete onClick={() => setifSharing(ifSharing => !ifSharing)}/>
        </div>
    )
}

export default Share

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import SharingButton from './SharingButton';
import { format } from 'timeago.js';

const UserProfile = ({ friends, unReaded, idOfUser, style, mobile, sharing, addSharedPost, idOfPost, sharingPost, createdAt }) => {
    const { backgroundColor3, backgroundColor1, onlineFriends } = useContext(GlobalContext);

    const [currentUser, setCurrentUser] = useState([]);

    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
        const getUrlAndCurrentUser = async () => {
            if (friends?.some(friend => friend._id === idOfUser)) {
                const dataOfUser = friends?.filter(friend => friend._id === idOfUser)[0];
                setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === dataOfUser._id));
            } else {
                // ziskame data uzivatele podle idOfUser
                const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
                // ulozime uzivatele do promenne currentUser
                setCurrentUser(currentUser.data);
                setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === currentUser.data._id));
            }


           
        }
        getUrlAndCurrentUser();
    }, [idOfUser, onlineFriends])

    return (
        <div style={sharing && { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "5px" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Link to={`/profile/${idOfUser}`} className="userProfile">
                    <div className="mainImg">
                        <img src={currentUser.idOrUrlOfProfilePicture ? currentUser.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" style={style} referrerPolicy="no-referrer" />
                        {isOnline && <div className="online" style={unReaded ? { border: "2px solid " + backgroundColor1 } : { border: "2px solid white" }}></div>}
                    </div>
                    {!mobile && <span style={{ color: backgroundColor3 }}>{currentUser?.username} {sharingPost && <span style={{ color: backgroundColor1 }}>sdílí</span>}</span>}
                </Link>
                {createdAt && <span style={{ color: backgroundColor3 }}>{format(createdAt, 'myLanguage')}</span>}
            </div>
            {sharing && <SharingButton addSharedPost={addSharedPost} idOfUser={idOfUser} idOfPost={idOfPost} />}
        </div>
    )
}

export default UserProfile

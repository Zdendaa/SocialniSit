import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import SharingButton from './SharingButton';

const UserProfile = ({onlineUsers, idOfUser, style, mobile, sharing, addSharedPost, idOfPost, sharingPost}) => {
    const {backgroundColor3, backgroundColor1} = useContext(GlobalContext);

    const [currentUser, setCurrentUser] = useState([]);

    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
        const getUrlAndCurrentUser = async () => {
            // ziskame data uzivatele podle idOfUser
            const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
            // ulozime uzivatele do promenne currentUser
            setCurrentUser(currentUser.data);
            
            setIsOnline(onlineUsers?.some(onlineUser => onlineUser.userId === currentUser.data._id));
        }
        getUrlAndCurrentUser();
    }, [idOfUser, onlineUsers])

    return (  
        <div style={sharing && {display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "5px"}}>
            <Link to={`/profile/${idOfUser}`} className="userProfile">
                <div className="mainImg">
                    <img src={currentUser.idOrUrlOfProfilePicture ? currentUser.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" style={style} referrerPolicy="no-referrer"/>
                    {console.log(isOnline)}
                    {isOnline && <div className="online"></div>}
                </div>
                {!mobile && <span style={{color: backgroundColor3}}>{currentUser?.username} {sharingPost && <span style={{color: backgroundColor1}}>sdílí</span>}</span>}
            </Link>
            
            {sharing && <SharingButton addSharedPost={addSharedPost} idOfUser={idOfUser} idOfPost={idOfPost}/>}
        </div>
    )
}

export default UserProfile

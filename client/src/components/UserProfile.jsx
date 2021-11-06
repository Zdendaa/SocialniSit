import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import { getUrlImgOrNull } from '../storageImgActions/imgFunctions';

const UserProfile = ({idOfUser, style, mobile}) => {
    const [url, setUrl] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getUrlAndCurrentUser = async () => {
            // ziskame data uzivatele podle idOfUser
            const currentUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
            // ulozime uzivatele do promenne currentUser
            setCurrentUser(currentUser.data);
            // ziskame jeho url profiloveho obrazku
            setUrl(await getUrlImgOrNull(currentUser.data));
        }
        getUrlAndCurrentUser();
    }, [idOfUser])

    
    return (
        <Link to={`/profile/${idOfUser}`}>
            {!mobile && <span>{currentUser?.username}</span>}
            <img src={url ? url : "/img/anonymous.png"} alt="" style={style}/>
        </Link>
    )
}

export default UserProfile

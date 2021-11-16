import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull } from '../storageImgActions/imgFunctions';

const UserProfile = ({idOfUser, style, mobile}) => {
    const {backgroundColor3} = useContext(GlobalContext);
    const [url, setUrl] = useState(null);

    const [currentUser, setCurrentUser] = useState([]);

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
        <Link to={`/profile/${idOfUser}`} className="userProfile">
            <img src={url ? url : "/img/anonymous.png"} alt="" style={style}/>
            {!mobile && <span style={{color: backgroundColor3}}>{currentUser?.username}</span>}
        </Link>
    )
}

export default UserProfile

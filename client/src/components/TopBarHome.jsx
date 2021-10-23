import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull } from '../storageImgActions/imgFunctions'
import { BiSearchAlt } from 'react-icons/bi'

const TopBarHome = () => {
    const {user, backgroundColor1} = useContext(GlobalContext);

    // promenna pro zobrazeni profilove fotky uzivatele
    const [url, setUrl] = useState(null);
    
    useEffect(() => {
        const downloadUrl = async () => {
            // dostani url obrazku uzivatele
            setUrl(await getUrlImgOrNull(user));
        }
        downloadUrl();
    }, [user.idOrUrlOfProfilePicture, user.username, user]);

    return (
        <div className="topBar" style={{backgroundColor: "white", color: backgroundColor1, borderBottom: "2px solid" + backgroundColor1}}>
            <p className="weight800">Nazev</p>
            <BiSearchAlt className="searchIcon"/>
            <div className="topBarProfile">
                <p className="weight800">{user.username}</p>
                <img className="profilePicture" src={user.idOrUrlOfProfilePicture ? url : "img/anonymous.png"} alt="" />
            </div>
        </div>
    )
}

export default TopBarHome

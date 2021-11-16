import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull } from '../storageImgActions/imgFunctions'
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useHistory } from 'react-router';

const TopBarHome = () => {
    const {user, deleteUser, backgroundColor1} = useContext(GlobalContext);
    const history = useHistory();
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
            <Link to="/" style={{textDecoration: "none", color: backgroundColor1}}>
                <p className="weight800" style={{cursor: "pointer"}}>Sociální síť</p>
            </Link>
            <SearchBar />
            <div className="topBarProfile">
                <Link to={`/profile/${user._id}`} className="userProfile" style={{color: backgroundColor1}}>
                    <p className="weight800">{user.username}</p>
                    <img className="profilePicture" src={user.idOrUrlOfProfilePicture ? url : "/img/anonymous.png"} alt="" />
                </Link>

            <div className="containerLogOut">
                <button className="buttonLogOut" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={ () => { 
                    localStorage.removeItem("user");
                    deleteUser();
                    history.push("/register");
                    
                } }>log out</button>
            </div>
            </div>
        </div>
    )
}

export default TopBarHome

import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { downloadUrlImg } from '../storageImgActions/imgFunctions'
import { GlobalContext } from '../context/GlobalState';
import validator from 'validator';

const Home = () => {
    const {user, deleteUser} = useContext(GlobalContext);
    const history = useHistory();
    const [url, setUrl] = useState(null);
    
    useEffect(() => {
        const downloadUrl = async () => {
            const url = user.idOrUrlOfProfilePicture ? ( validator.isURL(user.idOrUrlOfProfilePicture) ? user.idOrUrlOfProfilePicture : await downloadUrlImg("users/" + user.username + "/" + user.idOrUrlOfProfilePicture)) : null;
            setUrl(url);
        }
        downloadUrl();
    }, [user.idOrUrlOfProfilePicture, user.username])

    return (
        <div>
            home
            <button onClick={ () => { 
                localStorage.removeItem("user");
                deleteUser();
                history.push("/register");
                
             } }>log out</button>
             <div>
                <p>{user.username}</p>
                <img style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}} src={user.idOrUrlOfProfilePicture ? url : "img/anonymous.png"} alt="" />
             </div>
        </div>
        
    )
}

export default Home

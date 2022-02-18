import React, { useContext } from 'react'
import CropperImage from './CropperImage';
import { GlobalContext } from '../context/GlobalState';

const ChangeProfileImg = () => {
    const { user, socket, backgroundColor1 } = useContext(GlobalContext);

    return (
        <div className="settingsChangeProfilePicture">
            <h3 style={{color: backgroundColor1}}>Přidej novou profilovou fotku</h3>
            <img src={user.idOrUrlOfProfilePicture ? user.idOrUrlOfProfilePicture : "/img/anonymous.png"} alt="" referrerPolicy="no-referrer" style={{width: "120px", height: "120px", borderRadius: "50%"}}/>
            <CropperImage aspect={5/5} rect={false} socket={socket}/>
        </div>
    )
}

export default ChangeProfileImg

import React, { useContext } from 'react'
import CropperImage from './CropperImage';
import { GlobalContext } from '../context/GlobalState';

const ChangeProfileImg = () => {
    const { user, backgroundColor1 } = useContext(GlobalContext);

    return (
        <div className="settingsChangeProfilePicture">
            <h3 style={{color: backgroundColor1}}>Přidej novou profilovou fotku</h3>
            <img src={user.idOrUrlOfProfilePicture} alt="" referrerPolicy="no-referrer" style={{width: "120px", height: "120px"}}/>
            <CropperImage aspect={5/5} rect={false} />
        </div>
    )
}

export default ChangeProfileImg

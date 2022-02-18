import React, { useContext } from 'react';
import CropperImage from './CropperImage';
import { GlobalContext } from '../context/GlobalState';

const ChangeCoverImg = () => {
    const { user, socket, backgroundColor1} = useContext(GlobalContext);

    return (
        <>
            <hr className="lineNewPost" style={{backgroundColor: backgroundColor1, width: "100%"}}/>
            <div className="settingsChangeCoverPicture">
                <h3 style={{color: backgroundColor1}}>Přidej novou fotku na pozadí</h3>
                <img src={user.idOrUrlOfCoverPicture} alt="" referrerPolicy="no-referrer" style={{width: "80%", height: "auto"}}/>
                <CropperImage aspect={15/2} rect={true} socket={socket} />
            </div>
        </>
    )
}

export default ChangeCoverImg


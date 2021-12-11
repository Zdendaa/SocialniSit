
import React, { useContext } from 'react'
import ChangeCoverImg from '../components/ChangeCoverImg';
import ChangeProfileImg from '../components/ChangeProfileImg';

import CropperImage from '../components/CropperImage';
import TopBarHome from '../components/TopBarHome'
import { GlobalContext } from '../context/GlobalState'


const ProfileSettings = () => {
    const { user } = useContext(GlobalContext);

    
    return (
        <div className="ProfileSettings">
            <TopBarHome />
            <div className="ProfileSettingsContainer">
               
                <ChangeCoverImg />    
            </div>
            <ChangeProfileImg />     
        </div>
    )
}

export default ProfileSettings

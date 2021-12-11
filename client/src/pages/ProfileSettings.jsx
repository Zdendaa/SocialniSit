
import React from 'react'
import ChangeCoverImg from '../components/ChangeCoverImg';
import ChangeProfileImg from '../components/ChangeProfileImg';
import TopBarHome from '../components/TopBarHome'

const ProfileSettings = () => { 
    return (
        <div className="ProfileSettings">
            <TopBarHome />
            <div className="ProfileSettingsContainer">
                <ChangeProfileImg />
                <ChangeCoverImg />    
            </div>
        </div>
    )
}

export default ProfileSettings

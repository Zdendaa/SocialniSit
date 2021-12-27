
import React from 'react'
import ChangeColors from '../components/ChangeColors';
import ChangeCoverImg from '../components/ChangeCoverImg';
import ChangeProfileImg from '../components/ChangeProfileImg';
import SetUserInfo from '../components/SetUserInfo';
import TopBarHome from '../components/TopBarHome'

const ProfileSettings = () => { 
    return (
        <div className="ProfileSettings">
            <TopBarHome />
            <div className="ProfileSettingsContainer">
                <ChangeProfileImg />
                <ChangeCoverImg />   
                <SetUserInfo /> 
                <ChangeColors />
            </div>
        </div>
    )
}

export default ProfileSettings

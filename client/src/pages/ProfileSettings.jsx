
import React from 'react'
import ChangeColors from '../components/ChangeColors';
import ChangeCoverImg from '../components/ChangeCoverImg';
import ChangeProfileImg from '../components/ChangeProfileImg';
import Notifications from '../components/Notifications';
import SetUserInfo from '../components/SetUserInfo';
import TopBarHome from '../components/TopBarHome'

const ProfileSettings = ({socket}) => { 
    return (
        <div className="ProfileSettings">
            <TopBarHome socket={socket}/>
            <div className="ProfileSettingsContainer">
                <ChangeProfileImg socket={socket} />
                <ChangeCoverImg socket={socket}/>   
                <SetUserInfo /> 
                <ChangeColors />
            </div>
            <Notifications socket={socket}/>
        </div>
    )
}

export default ProfileSettings

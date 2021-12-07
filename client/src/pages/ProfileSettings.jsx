import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import TopBarHome from '../components/TopBarHome'
import { GlobalContext } from '../context/GlobalState'

const ProfileSettings = () => {
    const { user } = useContext(GlobalContext);

    return (
        <div className="ProfileSettings">
            <TopBarHome />
            <div className="ProfileSettingsContainer">
                <div className="settingsChangeProfilePicture">
                    <span>přidej novou profilovou fotku</span>
                    <img src={user.idOrUrlOfProfilePicture} alt="" />
                </div>
            </div>
        </div>
    )
}

export default ProfileSettings

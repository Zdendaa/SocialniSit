import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';

const UserInfo = ({ user }) => {
    const { backgroundColor1 } = useContext(GlobalContext);

    const [info, setInfo] = useState([]);

    useEffect(() => {
        // nacteni infa
        const getInfoAboutUser = async () => {
            setInfo([]);
            const newInfo = await axios.get(changePath(`/userInfos/getUserInfo/${user._id}`));
            setInfo(newInfo.data);
        }
        getInfoAboutUser();
    }, [user.idOfAllPicture, user._id]);

    return (
        <div className="profileInfoContainers">
            {
                info?.length === 0 ? 
                <>
                    <div className="profileInfoContainers">
                        <span>Popis:</span>
                        <span style={{color: backgroundColor1, fontWeight: "500"}}> - </span>
                    </div>
                    <div className="profileInfoContainers">
                        <span>Bydlí v:</span>
                        <span style={{color: backgroundColor1, fontWeight: "500"}}> - </span>

                    </div>
                    <div className="profileInfoContainers">
                        <span>Vztah:</span>
                        <span style={{ color: backgroundColor1, fontWeight: "500" }}> - </span>
                    </div> 
                </>
                :
                <>
                    <div className="profileInfoContainers">
                        <span>Popis:</span>
                        <span style={{color: backgroundColor1, fontWeight: "500"}}>{info.desc}</span>
                    </div>
                    <div className="profileInfoContainers">
                        <span>Bydlí v:</span>
                        <span style={{color: backgroundColor1, fontWeight: "500"}}>{info.from}</span>

                    </div>
                    <div className="profileInfoContainers">
                        <span>Vztah:</span>
                        <span style={{ color: backgroundColor1, fontWeight: "500" }}>{info.relationShip}</span>
                    </div> 
                </>
            }
        </div>
    )
}

export default UserInfo

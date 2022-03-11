import React, { useContext, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';

const UserChat = ({ users, chat }) => {
    const { backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [userOfChat] = useState(users?.filter(user => chat.usersId.includes(user._id))[0]);

    return (
        <div className="userChatMain">
            <div className="userChatContainer">
                <div className="mainDivImgChat">
                    <img src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} className="imgOfUserChat" alt="" />
                    {/*isOnline && <div className="online" style={unReaded ? { border: "2px solid " + backgroundColor1 } : { border: "2px solid white" }}></div>*/}
                    <div className="online" style={{ border: "2px solid " + backgroundColor4 }} />
                </div>
                <div className="InfoAboutChat">
                    <span>{userOfChat?.username}</span>
                    {chat.lastMessage && <span>{chat.lastMessage}</span>}
                </div>
            </div>
            <div className="numberOfNewMessages" style={{ backgroundColor: backgroundColor1 }} ><span>5</span></div>
        </div>
    )
}

export default UserChat
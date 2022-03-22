import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const UserChat = ({ users, chat, idOfActiveChat }) => {
    const { onlineFriends, backgroundColor1, backgroundColor2, backgroundColor4 } = useContext(GlobalContext);

    const [userOfChat, setUserOfChat] = useState(null);
    const [isOnline, setIsOnline] = useState();

    useEffect(() => {
        const currentUser = users?.filter(user => chat.usersId.includes(user._id))[0];
        setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === currentUser._id));
        setUserOfChat(currentUser);
        console.log(chat._id === idOfActiveChat, chat._id, idOfActiveChat);
    }, [users, chat])


    return (
        <Link to={`/messenger/${userOfChat?._id}/${chat._id}`} className="userChatMain" style={chat._id === idOfActiveChat ? {backgroundColor: backgroundColor2} : {backgroundColor: "white"}}>
            <div className="userChatContainer">
                <div className="mainDivImgChat">
                    <img src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} className="imgOfUserChat" alt="" />
                    {isOnline && <div className="online" style={{ border: "2px solid " + backgroundColor4 }} />}
                </div>
                <div className="InfoAboutChat">
                    <span>{userOfChat?.username}</span>
                    {chat.lastMessage && <span>{chat.lastMessage}</span>}
                </div>
            </div>
            <div className="numberOfNewMessages" style={{ backgroundColor: backgroundColor1 }} ><span>5</span></div>
        </Link>
    )
}

export default UserChat
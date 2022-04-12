import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';

const UserChat = ({ users, chat, idOfActiveChat, chats, setChats }) => {
    const { user, socket, onlineFriends, backgroundColor1, backgroundColor2, backgroundColor4 } = useContext(GlobalContext);

    const [userOfChat, setUserOfChat] = useState(null);
    const [isOnline, setIsOnline] = useState();

    const history = useHistory();
    useEffect(() => {
        const currentUser = users?.filter(user => chat?.usersId.includes(user?._id))[0];
        setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === currentUser._id));
        setUserOfChat(currentUser);
    }, [users, chat, onlineFriends])

    useEffect(() => {
        socket?.on("getMessage", (data) => {
            if (chats?.some(chat => chat?._id == data.idOfChat)) {
                var newChats = [...chats];
                newChats.filter(chat => chat._id === data.idOfChat)[0].lastMessage = data.text;
                newChats.filter(chat => chat._id === data.idOfChat)[0].lastIdOfUser = data.idOfSender;
                newChats.filter(chat => chat._id === data.idOfChat)[0].readed = false;
                setChats(newChats);
            }
        })
    }, [socket])

    const goToChat = async () => {
        await updateChatReadedTrue();
        history.push(`/messenger/${userOfChat?._id}/${chat._id}`);
    }

    const updateChatReadedTrue = async () => {
        var newChats = [...chats];
        if (!newChats.filter(currentChat => currentChat._id === chat._id)[0].readed) {
            newChats.filter(currentChat => currentChat._id === chat._id)[0].readed = true;
            setChats(newChats);
            await axios.put(changePath('/chats/updateReaded'), { id: chat._id, readed: true });
        }
    }

    return (
        <div onClick={goToChat} className="userChatMain" style={chat._id === idOfActiveChat ? { backgroundColor: backgroundColor2 } : { backgroundColor: "white" }}>
            <div className="userChatContainer">
                <div className="mainDivImgChat">
                    <img src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} className="imgOfUserChat" alt="" />
                    {isOnline && <div className="online" style={{ border: "2px solid " + backgroundColor4 }} />}
                </div>
                <div className="InfoAboutChat">
                    <span>{userOfChat?.username}</span>
                    <span className={(chat.lastIdOfUser !== user._id) ? (chat.readed ? "lastMessage" : "lastMessage unReaded") : "lastMessage"}>{chat?.lastMessage}</span>
                </div>
            </div>
            <div className="numberOfNewMessages" style={{ backgroundColor: backgroundColor1 }} ><span>5</span></div>
        </div>
    )
}

export default UserChat
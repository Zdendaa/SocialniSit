import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { MdArrowBack } from 'react-icons/md'
import { AiOutlineSend } from 'react-icons/ai';
import { Link, useHistory } from 'react-router-dom';

const Chat = ({ userOfChat, idOfChat }) => {
    const { user, socket, onlineFriends, backgroundColor1, backgroundColor2, backgroundColor3, backgroundColor4 } = useContext(GlobalContext);

    const history = useHistory();
    
    const [error, setError] = useState(false);

    const [isOnline, setIsOnline] = useState();
    const [messages, setMessages] = useState([]);

    const [valOfText, setValOfText] = useState("");

    useEffect(() => {
        setMessages([]);
        const getMessages = async () => {
            const messages = await axios.get(changePath(`/messages/getAllMessages/${idOfChat}`));
            setMessages(messages.data);
            sortMessagesByDate();
        }
        setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === userOfChat?._id));
        getMessages();
        console.log(idOfChat);
    }, [userOfChat, idOfChat]);

    useEffect(() => {
        socket?.on("getMessage", (data) => {
            if (data.idOfChat === idOfChat) {
                console.log(messages.filter(message => message._id === data._id));
                if (messages.filter(message => message._id === data._id).length === 0) {
                    setMessages((prev) => [...prev, data]);
                    sortMessagesByDate();
                }
            }
        })
    }, [socket])


    const addMessage = async () => {
        if(valOfText == "") {
            setError(true);
            return;
        }
        setError(false);
        var newChat = [];
        if(idOfChat == '0') {
            newChat = await axios.post(changePath('/chats/createChat'), {usersId: [userOfChat._id, user._id]});
        }
        const newMessage = await axios.post(changePath(`/messages/addMessage`), { idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: idOfChat == "0" ? newChat.data._id : idOfChat, text: valOfText });
        setMessages((prev) => [...prev, newMessage.data]);
        sortMessagesByDate();
        setValOfText("");
        // zavolani socketu
        socket?.emit("sendMessage", { idOfMessage: newMessage.data._id, idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: idOfChat, text: valOfText });
        idOfChat == '0' && history.push(`/messenger/${userOfChat._id}/${newChat.data._id}`);
    }

    const sortMessagesByDate = () => {
        setMessages((prev) => [...prev.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt) })]);
    }

    return (
        <div className='Chat'>
            <div className="userChat" style={{ backgroundColor: backgroundColor4 }}>
                <div className="mainDivImgChat">
                    <img src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} className="imgOfUserChat" alt="" />
                    {isOnline && <div className="online" style={{ border: "2px solid " + backgroundColor4 }} />}
                </div>
                <span>{userOfChat?.username}</span>
            </div>
            <Link to={`/messenger/${user._id}/0`} className='backChatArrow'><MdArrowBack style={{ color: backgroundColor1 }} /></Link>
            <div className='messagesContainer'>
                {
                    messages.map((message) => (
                        <div className={message.idOfSender === user._id ? "myMessage" : "yourMessage"}>
                            <span style={message.idOfSender === user._id ? { backgroundColor: backgroundColor1 } : { backgroundColor: backgroundColor2, color: backgroundColor3 }} >{message.text}</span>
                        </div>
                    ))
                }
            </div>
            <div className='addMessageContainer' onKeyPress={(event) => event.key == 'Enter' && addMessage()}>
                <input type="text" placeholder='zadej text...' onChange={(e) => setValOfText(e.target.value)} value={valOfText} className={error && "error"} />
                <button style={{ backgroundColor: backgroundColor1 }} onClick={addMessage} ><AiOutlineSend style={{fontSize: "19px"}}/></button>
            </div>
        </div >
    )
}

export default Chat
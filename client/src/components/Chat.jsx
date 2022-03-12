import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';

const Chat = ({ userId, idOfChat }) => {
    const { user, onlineFriends, backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [userOfChat, setUserOfChat] = useState(null);
    const [isOnline, setIsOnline] = useState();
    const [messages, setMessages] = useState([]);

    const [valOfText, setValOfText] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const currentUser = await axios.get(changePath(`/users/getUser/${userId}`));
            setUserOfChat(currentUser.data);
            setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === currentUser.data._id));
        }
        const getMessages = async () => {
            const messages = await axios.get(changePath(`/messages/getAllMessages/${idOfChat}`));
            console.log(messages.data);
            setMessages(messages.data);
        }
        getUser();
        getMessages();
    }, [userId])

    const addMessage = async () => {
        const newMessage = await axios.post(changePath(`/messages/addMessage`), { idOfSender: user._id, idOfReciever: userId, idOfChat: idOfChat, text: valOfText });
        console.log(newMessage)
        setValOfText("");
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
            <div className='messagesContainer'>
                {
                    messages.map((message) => (
                        <span>{message.text}</span>
                    ))
                }
            </div>
            <div className='addMessageContainer'>
                <input type="text" placeholder='zadej text...' onChange={(e) => setValOfText(e.target.value)} value={valOfText} />
                <button style={{ backgroundColor: backgroundColor1 }} onClick={addMessage} >sd</button>
            </div>
        </div>
    )
}

export default Chat
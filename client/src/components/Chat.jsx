import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { MdArrowBack } from 'react-icons/md'
import { AiOutlineSend } from 'react-icons/ai';
import { Link, useHistory } from 'react-router-dom';
import Message from './Message';
import { AnimatePresence } from 'framer-motion';
import ClipLoader from "react-spinners/ClipLoader";

const Chat = ({ userOfChat, idOfChat, setChats, chats }) => {
    const { user, socket, onlineFriends, backgroundColor1, backgroundColor2, backgroundColor4 } = useContext(GlobalContext);
    const history = useHistory();

    const [error, setError] = useState(false);

    const [isOnline, setIsOnline] = useState();
    const [messages, setMessages] = useState([]);
    const [idOfLastReadedMessage, setIdOfLastReadedMessage] = useState();

    const [valOfText, setValOfText] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMessages([]);
        const getMessages = async () => {
            const messages = await axios.get(changePath(`/messages/getAllMessages/${idOfChat}`));
            var DataOfMessages = messages.data;
            for (var index = 0; index < DataOfMessages.length; index++) {
                if (DataOfMessages[index].idOfReciever === user?._id) DataOfMessages[index].readed = true;
            }
            setMessages(DataOfMessages);
            sortMessagesByDate();
        }
        getMessages();
    }, [idOfChat]);

    // nastaveni id podledni prectene zpravy a poslani cez socket druhemu uzivatelovi precteni zpravy
    useEffect(() => {
        for (var index = 0; index < messages.length; index++) {
            if (!messages[index].readed && messages[index].idOfSender === user?._id) {
                setIdOfLastReadedMessage(messages[index - 1]?._id);
                console.log("ahoj");
                socket?.emit("setReadedMessage", { idOfMessage: messages[index - 1]?._id, idOfUser: userOfChat?._id, idOfChat: idOfChat });
                break;
            } else {
                if (index == messages.length - 1) {
                    setIdOfLastReadedMessage(messages[index]._id);
                    socket?.emit("setReadedMessage", { idOfMessage: messages[index]._id, idOfUser: userOfChat?._id, idOfChat: idOfChat });
                }
            }
        }
    }, [messages])

    // precteni zprav
    useEffect(() => {
        const readedMessages = async () => {
            await axios.put(changePath(`/messages/setReadedAllMessage`), { idOfChat: idOfChat, idOfSender: userOfChat?._id });
            socket?.emit("setReadedMessage", { idOfMessage: null, idOfUser: userOfChat?._id, idOfChat: idOfChat });
        }
        readedMessages();
    }, [userOfChat])


    useEffect(() => {
        setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === userOfChat?._id));
    }, [onlineFriends, userOfChat, idOfChat]);

    // prihlaseni k socketu
    useEffect(() => {
        socket?.on("getMessage", (data) => {
            var idOfCurrentChat = window.location.href.split('/')[5]; // useParams nefunguje v socket.io proto jsem zvolil tuto moznost ziskani parametru v url adrese

            if (data.idOfChat === idOfCurrentChat) { // jestli se id shoduje s nasim otevrenym chatem
                setMessages((prev) => [...prev, data]);
                socket?.emit("setReadedMessage", { idOfMessage: data._id, idOfUser: data.idOfSender, idOfChat: data.idOfChat });
                sortMessagesByDate();
            }
        })
    }, [socket])

    useEffect(() => {
        socket?.on("getReadedMessage", (data) => {
            var idOfCurrentChat = window.location.href.split('/')[5]; // useParams nefunguje v socket.io proto jsem zvolil tuto moznost ziskani parametru v url adrese
            if (data.idOfChat === idOfCurrentChat) {
                setMessages(messages => {
                    var DataOfMessages = messages;
                    for (var index = 0; index < DataOfMessages.length; index++) {
                        DataOfMessages[index].readed = true;
                        if (DataOfMessages[index]._id === data._id && data._id) break;
                    }
                    setIdOfLastReadedMessage(data._id || DataOfMessages[DataOfMessages.length - 1]?._id);
                    console.log(data._id, DataOfMessages[DataOfMessages.length - 1]?._id);
                    return DataOfMessages;
                });
            }
        })
    }, [socket])

    const addMessage = async () => {
        if (valOfText == "") {
            setError(true);
            return;
        }
        setError(false);
        setLoading(true);
        var newChat = [];
        var newMessage;
        if (idOfChat == '0') {
            newChat = await axios.post(changePath('/chats/createChat'), { usersId: [userOfChat._id, user._id], lastMessage: valOfText, lastIdOfUser: user._id });
            newMessage = await axios.post(changePath(`/messages/addMessage`), { idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: newChat.data._id, text: valOfText });
            setMessages((prev) => [...prev, newMessage.data]);
            sortMessagesByDate();
            setValOfText("");
            setLoading(false);
        } else {
            newMessage = await axios.post(changePath(`/messages/addMessage`), { idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: idOfChat, text: valOfText });
            setMessages((prev) => [...prev, newMessage.data]);
            sortMessagesByDate();
            setValOfText("");
            setLoading(false);
            // kdyz uz existuje chat tak aktualizujeme lastMessage jak na backendu tak na frontendu
            await axios.put(changePath('/chats/setLastMessage'), { id: idOfChat, lastMessage: valOfText, readed: false, lastIdOfUser: user._id });
            updateChats();
        }

        // zavolani socketu
        socket?.emit("sendMessage", { idOfMessage: newMessage.data._id, idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: idOfChat, text: valOfText });
        idOfChat == '0' && history.push(`/messenger/${userOfChat._id}/${newChat.data._id}`);
    }

    const updateChats = () => {
        var newChats = [...chats];
        newChats.filter(chat => chat._id === idOfChat)[0].lastMessage = valOfText;
        newChats.filter(chat => chat._id === idOfChat)[0].readed = true;
        setChats(newChats);
    }

    const sortMessagesByDate = () => {
        setMessages((prev) => [...prev.sort((p1, p2) => { return new Date(p1.createdAt) - new Date(p2.createdAt) })]);
        scrollToDown();
    }

    const scrollToDown = () => {
        var div = document.getElementsByClassName("messagesContainer")[0];
        div.scrollTop = div?.scrollHeight;
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
                <AnimatePresence
                    initial={false}
                    // exitBeforeEnter={true}
                    onExitComplete={() => null}
                >
                    {
                        messages?.map((message) => (
                            <Message idOfReadedMessage={idOfLastReadedMessage} message={message} key={message._id} userOfChat={userOfChat} />
                        ))
                    }
                </AnimatePresence>
            </div>
            <div className='addMessageContainer' onKeyPress={(event) => event.key == 'Enter' && addMessage()}>
                <input type="text" placeholder='zadej text...' onChange={(e) => setValOfText(e.target.value)} value={valOfText} className={error ? "error" : "noError"} />
                <button style={{ backgroundColor: backgroundColor1 }} onClick={addMessage} >{!loading ? <AiOutlineSend style={{ fontSize: "19px" }} /> : <ClipLoader color={backgroundColor2} size={10} />}</button>
            </div>
        </div >
    )
}

export default Chat
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
import VoiceMessage from './addMessageVariants/VoiceMessage';
import { TiDelete } from 'react-icons/ti';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import VideoMessage from './addMessageVariants/VideoMessage';
import PhotoMessage from './addMessageVariants/PhotoMessage';
import EmojiPicker from './addMessageVariants/EmojiPicker';

const Chat = ({ userOfChat, idOfChat, setChats, chats }) => {
    const { user, setNumberOfNewMessages, socket, onlineFriends, backgroundColor1, backgroundColor2, backgroundColor4 } = useContext(GlobalContext);
    const history = useHistory();

    const [error, setError] = useState(false);

    const [isOnline, setIsOnline] = useState();
    const [messages, setMessages] = useState([]);
    const [idOfLastReadedMessage, setIdOfLastReadedMessage] = useState();

    const [valOfText, setValOfText] = useState("");

    const [loading, setLoading] = useState(false);

    // urls
    const [voiceFile, setVoiceFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

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
        readedMessages();
    }, [userOfChat])
    const readedMessages = async () => {
        await axios.put(changePath(`/messages/setReadedAllMessage`), { idOfChat: idOfChat, idOfSender: userOfChat?._id });
        socket?.emit("setReadedMessage", { idOfMessage: null, idOfUser: userOfChat?._id, idOfChat: idOfChat });
        const newData = await axios.post(changePath(`/messages/getNumberOfUnreadedMessagesInMessenger`), { myId: user._id });
        setNumberOfNewMessages(newData.data);
    }
    // precteni zpravy 
    useEffect(() => {
        socket?.on("getMessage", async (data) => {
            var idOfCurrentChat = window.location.href.split('/')[5]; // useParams nefunguje v socket.io proto jsem zvolil tuto moznost ziskani parametru v url adrese
            if (data.idOfChat === idOfCurrentChat) { // jestli se id shoduje s nasim otevrenym chatem
                await readedMessages();
            }
        })
    }, [socket, userOfChat])

    useEffect(() => {
        setIsOnline(onlineFriends?.some(onlineUser => onlineUser.userId === userOfChat?._id));
    }, [onlineFriends, userOfChat, idOfChat]);

    // prihlaseni k socketu
    useEffect(() => {
        socket?.on("getMessage", async (data) => {
            var idOfCurrentChat = window.location.href.split('/')[5]; // useParams nefunguje v socket.io proto jsem zvolil tuto moznost ziskani parametru v url adrese
            if (data.idOfChat === idOfCurrentChat) { // jestli se id shoduje s nasim otevrenym chatem
                data.readed = true;
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
                    return DataOfMessages;
                });
            }
        })
    }, [socket])


    const addMessage = async () => {
        if (valOfText == "" && !voiceFile && !photoFile && !videoFile) {
            setError(true);
            return;
        }
        setError(false);
        setLoading(true);
        // voice 
        const voiceName = voiceFile && await uploadFileMessage(voiceFile.blob);
        const voiceUrl = voiceName && await downloadUrlImg(voiceName);
        // img
        const photoName = photoFile && await uploadFileMessage(photoFile);
        const photoUrl = photoName && await downloadUrlImg(photoName);
        // img
        const videoName = videoFile && await uploadFileMessage(videoFile);
        const videoUrl = videoName && await downloadUrlImg(videoName);

        // video
        var newChat = [];
        var newMessage;
        if (idOfChat == '0') {
            newChat = await axios.post(changePath('/chats/createChat'), { usersId: [userOfChat._id, user._id], lastMessage: valOfText, lastMessageTime: Date.now(), lastIdOfUser: user._id });
            newMessage = await axios.post(changePath(`/messages/addMessage`), { idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: newChat.data._id, text: valOfText, urlOfVoice: voiceUrl, urlOfImg: photoUrl, urlOfVideo: videoUrl });
            setMessages((prev) => [...prev, newMessage.data]);
            sortMessagesByDate();
            setValOfText("");
            setVoiceFile(null);
            setPhotoFile(null);
            setVideoFile(null);
            setLoading(false);
        } else {
            newMessage = await axios.post(changePath(`/messages/addMessage`), { idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: idOfChat, text: valOfText, urlOfVoice: voiceUrl, urlOfImg: photoUrl, urlOfVideo: videoUrl });
            setMessages((prev) => [...prev, newMessage.data]);
            sortMessagesByDate();
            setValOfText("");
            setPhotoFile(null);
            setVoiceFile(null);
            setVideoFile(null);
            setLoading(false);
            // kdyz uz existuje chat tak aktualizujeme lastMessage jak na backendu tak na frontendu
            await axios.put(changePath('/chats/setLastMessage'), { id: idOfChat, lastMessage: valOfText, lastMessageTime: Date.now(), readed: false, lastIdOfUser: user._id });
            updateChats();
        }
        // zavolani socketu
        socket?.emit("sendMessage", { idOfMessage: newMessage.data._id, idOfSender: user._id, idOfReciever: userOfChat._id, idOfChat: idOfChat, text: valOfText, urlOfVoice: voiceUrl, urlOfImg: photoUrl, urlOfVideo: videoUrl });
        idOfChat == '0' && history.push(`/messenger/${userOfChat._id}/${newChat.data._id}`);
    }

    const updateChats = () => {
        var newChats = [...chats];
        newChats.filter(chat => chat._id === idOfChat)[0].lastMessageTime = Date.now();
        newChats.filter(chat => chat._id === idOfChat)[0].readed = true;
        newChats.filter(chat => chat._id === idOfChat)[0].readed = true;
        setChats(newChats);
    }



    const sortMessagesByDate = () => {
        setMessages((prev) => [...prev.sort((p1, p2) => { return new Date(p1.createdAt) - new Date(p2.createdAt) })]);
        scrollToDown();
    }

    const scrollToDown = () => {
        var div = document.getElementsByClassName("messagesContainer")[0];
        try {
            div.scrollTop = div?.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }
    // funkce pro ukladani do uloziste
    const uploadFileMessage = async (file, typeOf) => {
        const newFileMessageName = "messenger/" + user.username + "/" + (typeOf ? file.size : file.name) + "" + Math.floor(Date.now() / 1000);
        await uploadImg(file, newFileMessageName).then(async () => {
            console.log('file message upload succesfully');
        })
        return newFileMessageName;
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
            <div className='addMessageContainer' onKeyPress={(event) => event.key == 'Enter' && addMessage(null)}>
                <div className='leftDiv'>
                    <div className='actionsButton'>
                        <VoiceMessage setUrlOfVoice={setVoiceFile} />
                        <VideoMessage setVideoFile={setVideoFile} />
                        <PhotoMessage setPhotoFile={setPhotoFile} />
                    </div>
                    {
                        !photoFile && !voiceFile && !videoFile
                            ?
                            <input type="text" placeholder='zadej text...' onChange={(e) => setValOfText(e.target.value)} value={valOfText} className={error ? "error inputForTextInMessenger" : "noError inputForTextInMessenger"} />
                            :
                            <div className='smallExampleDiv'>
                                <div className='smallExampleMainContainer'>
                                    {
                                        photoFile &&
                                        <div className='smallExampleContainer'>
                                            <img className='smallExample' src={URL.createObjectURL(photoFile)} alt="" />
                                            <TiDelete className="removeImgShow scaled" onClick={() => { setPhotoFile(null) }} />
                                        </div>
                                    }
                                    {
                                        videoFile &&
                                        <div className='smallVoiceExampleContainer'>
                                            <video className='videoSmallExample' controls src={URL.createObjectURL(videoFile)}>
                                            </video>
                                            <TiDelete className="removeImgShow scaled" onClick={() => { setVideoFile(null) }} />
                                        </div>
                                    }
                                    {
                                        voiceFile &&
                                        <div className='smallVoiceExampleContainer'>
                                            <audio className='audioSmallExample' controls src={voiceFile.url}></audio>
                                            <TiDelete className="removeImgShow scaled" onClick={() => { setVoiceFile(null) }} />
                                        </div>
                                    }
                                </div>
                                <input type="text" placeholder='zadej text...' onChange={(e) => setValOfText(e.target.value)} value={valOfText} style={{ width: "auto" }} className={error ? "error inputForTextInMessenger" : "noError inputForTextInMessenger"} />

                            </div>
                    }
                </div>
                <EmojiPicker setValOfText={setValOfText} />
                <button style={{ backgroundColor: backgroundColor1 }} className='buttonsForVariantsMessage opacity' onClick={() => addMessage(null)} >{!loading ? <AiOutlineSend style={{ fontSize: "19px" }} /> : <ClipLoader color={backgroundColor2} size={10} />}</button>

            </div>
        </div >
    )
}

export default Chat
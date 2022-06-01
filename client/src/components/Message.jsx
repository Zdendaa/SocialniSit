import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { motion } from 'framer-motion';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import axios from 'axios';
import changePath from '../changePath';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";

const Message = ({ message, userOfChat, idOfReadedMessage }) => {
    const { user, backgroundColor1, backgroundColor2, backgroundColor3 } = useContext(GlobalContext);
    const [date, setDate] = useState();

    // promenna pro pocet liku
    const [lenghtOfLikes, setLenghtOfLikes] = useState(message?.idOfLikes?.length || []);

    // promenna zdali jsem prispevek likenul
    const [ifIsLiked, setIfIsLiked] = useState(message?.idOfLikes?.includes(user._id));

    useEffect(() => {
        setDate(new Date(message.createdAt));
    }, [message])

    // pridani nebo odebrani likeu
    const addOrRemoveLike = async () => {
        ifIsLiked ? setLenghtOfLikes(lenght => lenght - 1) : setLenghtOfLikes(lenght => lenght + 1);
        setIfIsLiked(!ifIsLiked);
        await axios.put(changePath(`/messages/addOrRemoveLike/${message._id}`), { userId: user._id });
        console.log("hotovo");
    }

    return (
        message.idOfSender === user._id ?
            <>
                <motion.div onDoubleClick={addOrRemoveLike} className={idOfReadedMessage === message._id ? "marginBottom myMessage" : "myMessage"}
                    initial={{ scale: 0.2 }}
                    animate={{ scale: 1 }}
                >
                    <div className="myMessageTimeMessage">
                        {message.text && <div className="textInMessage" style={{ backgroundColor: backgroundColor1 }} >{message.text}</div>}
                        {message.urlOfVoice && <audio controls src={message.urlOfVoice}></audio>}
                        {message.urlOfImg && <img className='imgInMessage' src={message.urlOfImg} />}
                        {message.urlOfVideo && <video className='videoInMessage' controls src={message.urlOfVideo}></video>}
                        <span style={{ textAlign: "right" }}>{(Date.now() - (date?.getTime())) / 3600000 > 24 && `${date?.getDate()}.${date?.getMonth()}.`} {date?.getHours()}:{date?.getMinutes()}</span>
                        {lenghtOfLikes > 0 && (ifIsLiked ? <div className='likesOfMessage'><FcLike style={{ cursor: "pointer" }} className="scaled icon" onClick={addOrRemoveLike} />{lenghtOfLikes}</div> : <div className='likesOfMessage'><FcLikePlaceholder className="scaled icon" style={{ cursor: "pointer" }} onClick={addOrRemoveLike} />{lenghtOfLikes}</div>)}
                    </div>
                </motion.div>
                {!message.readed && <div className='profileImgReadedContainer'><AiOutlineCheckCircle className="profileImgInMessageReaded" /></div>}
                {idOfReadedMessage === message._id && <div className='profileImgReadedContainer'><img className="profileImgInMessageReaded alwaysRight" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" /></div>}
            </>
            :
            <>
                <motion.div onDoubleClick={addOrRemoveLike} className={idOfReadedMessage === message._id ? "marginBottom yourMessage" : "yourMessage"}
                    initial={{ scale: 0.2 }}
                    animate={{ scale: 1 }}
                >
                    <img className="profileImgInMessage" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" />
                    <div className="yourMessageTimeMessage">
                        {message.text && <div className="textInMessage" style={{ backgroundColor: backgroundColor2, color: backgroundColor3 }} >{message.text}</div>}
                        {message.urlOfVoice && <audio controls src={message.urlOfVoice}></audio>}
                        {message.urlOfImg && <img className='imgInMessage' src={message.urlOfImg} />}
                        {message.urlOfVideo && <video className='videoInMessage' controls src={message.urlOfVideo}></video>}
                        <span style={{ color: backgroundColor1 }}>{(Date.now() - (date?.getTime())) / 3600000 > 24 && `${date?.getDate()}.${date?.getMonth()}.`} {date?.getHours()}:{date?.getMinutes()}</span>
                        {lenghtOfLikes > 0 && (ifIsLiked ? <div className='likesOfMessage'><FcLike style={{ cursor: "pointer" }} className="scaled icon" onClick={addOrRemoveLike} />{lenghtOfLikes}</div> : <div className='likesOfMessage'><FcLikePlaceholder className="scaled icon" style={{ cursor: "pointer" }} onClick={addOrRemoveLike} />{lenghtOfLikes}</div>)}
                    </div>
                </motion.div>
                {idOfReadedMessage === message._id && <div className='profileImgReadedContainer'><img className="profileImgInMessageReaded alwaysRight" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" /></div>}
            </>
    )
}

export default Message
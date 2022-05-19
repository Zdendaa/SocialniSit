import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { motion } from 'framer-motion';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const Message = ({ message, userOfChat, idOfReadedMessage }) => {
    const { user, backgroundColor1, backgroundColor2, backgroundColor3 } = useContext(GlobalContext);
    const [date, setDate] = useState();

    useEffect(() => {
        setDate(new Date(message.createdAt));
    }, [message])

    return (
        message.idOfSender === user._id ?
            <>
                <motion.div className={idOfReadedMessage === message._id ? "marginBottom myMessage" : "myMessage"}
                    initial={{ scale: 0.2 }}
                    animate={{ scale: 1 }}
                >
                    <div className="myMessageTimeMessage">
                        {message.text && <div className="textInMessage" style={{ backgroundColor: backgroundColor1 }} >{message.text}</div>}
                        {message.urlOfVoice && <audio controls src={message.urlOfVoice}></audio>}
                        {message.urlOfImg && <img className='imgInMessage' src={message.urlOfImg} />}
                        <span style={{ textAlign: "right" }}>{(Date.now() - (date?.getTime())) / 3600000 > 24 && `${date?.getDate()}.${date?.getMonth()}.`} {date?.getHours()}:{date?.getMinutes()}</span>

                    </div>
                </motion.div>
                {!message.readed && <div className='profileImgReadedContainer'><AiOutlineCheckCircle className="profileImgInMessageReaded" /></div>}
                {idOfReadedMessage === message._id && <div className='profileImgReadedContainer'><img className="profileImgInMessageReaded alwaysRight" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" /></div>}
            </>
            :
            <>
                <motion.div className={idOfReadedMessage === message._id ? "marginBottom yourMessage" : "yourMessage"}
                    initial={{ scale: 0.2 }}
                    animate={{ scale: 1 }}
                >
                    <img className="profileImgInMessage" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" />
                    <div className="yourMessageTimeMessage">
                        <div className="textInMessage" style={{ backgroundColor: backgroundColor2, color: backgroundColor3 }} >{message.text}</div>
                        <span style={{ color: backgroundColor1 }}>{(Date.now() - (date?.getTime())) / 3600000 > 24 && `${date?.getDate()}.${date?.getMonth()}.`} {date?.getHours()}:{date?.getMinutes()}</span>
                    </div>
                </motion.div>
                {idOfReadedMessage === message._id && <div className='profileImgReadedContainer'><img className="profileImgInMessageReaded alwaysRight" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" /></div>}
            </>
    )
}

export default Message
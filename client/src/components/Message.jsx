import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import { motion } from 'framer-motion';

const Message = ({ message, userOfChat, idOfReadedMessage }) => {
    const { user, backgroundColor1, backgroundColor2, backgroundColor3 } = useContext(GlobalContext);
    const [date, setDate] = useState();

    useEffect(() => {
        setDate(new Date(message.createdAt));
    }, [message])

    return (
        message.idOfSender === user._id ?
            <motion.div className="myMessage"
                initial={{ scale: 0.2 }}
                animate={{ scale: 1 }}
            >
                <div className="myMessageTimeMessage">
                    <div className="textInMessage" style={{ backgroundColor: backgroundColor1 }} >{message.text}</div>
                    <span style={{ textAlign: "right" }}>{(Date.now() - (date?.getTime())) / 3600000 > 24 && `${date?.getDate()}.${date?.getMonth()}.`} {date?.getHours()}:{date?.getMinutes()}</span>
                    {idOfReadedMessage === message._id && <img className="profileImgInMessage" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" />}

                </div>
                {message.readed && "ahoj"}
            </motion.div>
            :
            <motion.div className="yourMessage"
                initial={{ scale: 0.2 }}
                animate={{ scale: 1 }}
            >
                <img className="profileImgInMessage" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" />
                <div className="yourMessageTimeMessage">
                    <div className="textInMessage" style={{ backgroundColor: backgroundColor2, color: backgroundColor3 }} >{message.text}</div>
                    <span style={{ color: backgroundColor1 }}>{(Date.now() - (date?.getTime())) / 3600000 > 24 && `${date?.getDate()}.${date?.getMonth()}.`} {date?.getHours()}:{date?.getMinutes()}</span>
                    {idOfReadedMessage === message._id && <img className="profileImgInMessage" src={userOfChat?.idOrUrlOfProfilePicture || "/img/anonymous.png"} alt="" />}
                </div>
            </motion.div>
    )
}

export default Message
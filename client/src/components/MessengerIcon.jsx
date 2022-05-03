import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';

const MessengerIcon = () => {
    const { user, socket, numberOfNewMessages, setNumberOfNewMessages, backgroundColor1 } = useContext(GlobalContext);

    const [number, setNumber] = useState();
    useEffect(() => {
        const getNumberOfNewMessages = async () => {
            if (!numberOfNewMessages) {
                const data = await axios.post(changePath(`/messages/getNumberOfUnreadedMessagesInMessenger`), { myId: user._id });
                setNumberOfNewMessages(data.data);
                setNumber(data.data);
            } else {
                setNumber(numberOfNewMessages);
            }
        }
        getNumberOfNewMessages();
    }, [])

    useEffect(() => {
        setNumber(numberOfNewMessages);
    }, [numberOfNewMessages])


    // prihlaseni k socketu
    useEffect(() => {
        socket?.on("getMessage", async (data) => {
            var idOfCurrentChat = window.location.href.split('/')[5]; // useParams nefunguje v socket.io proto jsem zvolil tuto moznost ziskani parametru v url adrese
            if (data.idOfReciever === user._id && data.idOfChat !== idOfCurrentChat) {
                const data = await axios.post(changePath(`/messages/getNumberOfUnreadedMessagesInMessenger`), { myId: user._id });
                setNumber(data.data);
                setNumberOfNewMessages(data.data);
            }
        })
    }, [socket])
    return (
        <Link to={`/messenger/${user._id}/0`} style={{ textDecoration: "none", marginLeft: "10px", position: "relative" }}>
            <FiMessageCircle className="searchIcon scaled pointer" style={{ color: backgroundColor1 }} />
            {number > 0 && <div className="numberOfNewMessagesinMessenger"><span>{number}</span></div>}
        </Link>
    )
}

export default MessengerIcon
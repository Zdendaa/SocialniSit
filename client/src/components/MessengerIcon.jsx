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
        getNumberOfNewMessages();
    }, [])

    useEffect(() => {
        setNumber(numberOfNewMessages);
    }, [numberOfNewMessages])


    // prihlaseni k socketu
    useEffect(() => {
        socket?.on("getMessage", async (data) => {
            var idOfCurrentChat = window.location.href.split('/')[5]; // useParams nefunguje v socket.io proto jsem zvolil tuto moznost ziskani parametru v url adrese
            if (data.idOfChat !== idOfCurrentChat) {
                // setNumber(prev => {
                //     setNumberOfNewMessages(typeof prev == "number" ? prev + 1 : 1);
                //     return prev + 1;
                // });
                getNumberOfNewMessages();
            }
        })
    }, [socket])

    const getNumberOfNewMessages = async () => {
        if (!numberOfNewMessages) {
            const data = await axios.post(changePath(`/messages/getNumberOfUnreadedMessagesInMessenger`), { myId: user._id });
            setNumberOfNewMessages(data.data);
            setNumber(data.data);
        } else {
            setNumber(numberOfNewMessages);
        }
    }
    return (
        <Link to={`/messenger/${user._id}/0`} className="scaled pointer" style={{ textDecoration: "none", marginLeft: "10px", position: "relative" }}>
            <FiMessageCircle className="searchIcon" style={{ color: backgroundColor1 }} />
            {number > 0 && <div className="numberOfNewMessagesinMessenger"><span>{number}</span></div>}
        </Link>
    )
}

export default MessengerIcon
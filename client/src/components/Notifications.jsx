import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { HiOutlineBell } from 'react-icons/hi';
import { useHistory } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import Post from './Post';
import UserProfile from './UserProfile';
import { format, register } from 'timeago.js';
import czDataFormat from '../format.jsCZ/CzFormat';
import PopupWindown from './global/PopupWindown';
import { AnimatePresence } from 'framer-motion';

const Notifications = () => {
    // registrovani cestiny do formatjs
    register('myLanguage', czDataFormat);


    const { user, socket, backgroundColor1, backgroundColor2, backgroundColor4 } = useContext(GlobalContext);

    // useState promenne

    const [notifications, setNotifications] = useState([]);

    const [numberOfNewNotifications, setNumberOfNewNotifications] = useState();

    const [showNotifications, setShowNotifications] = useState(false);

    const [showPost, setShowPost] = useState(false);
    const [dataOfPost, setDataOfPost] = useState([]);

    const [friends, setFriends] = useState();

    const history = useHistory();

    // useEffect

    useEffect(() => {
        const setAllNotifications = async () => {
            // nacteni vsech notifikaci daneho uzivatele
            const allNotifications = await axios.get(changePath(`/notifications/getAllNotifications/${user._id}`));
            setNotifications(allNotifications.data);
            setNumberOfNewNotifications(allNotifications.data.filter(notification => notification.readed === false).length);
            sortNotificationsByDate();
        }
        setAllNotifications();
    }, [user._id])

    useEffect(() => {
        socket?.on("getNotification", (data) => {
            console.log("new notification", data);
            setNotificationsNewData(data);
        })
    }, [socket])

    useEffect(() => {
        const fetchAllFriends = async () => {
            const dataOfFriends = await axios.get(changePath(`/users/getAllFriends/${user._id}`));
            setFriends(dataOfFriends.data);
        }
        fetchAllFriends();
    }, [])


    // funkce

    const setNotificationsNewData = (data) => {
        setNumberOfNewNotifications(prev => prev + 1);
        setNotifications((notifications) => [...notifications, { _id: data.id, senderId: data.senderId, recieverId: data.recieverId, type: data.type, url: data.url, idOfPost: data.idOfPost, text: data.text, createdAt: data.date }]);
        sortNotificationsByDate();
    }

    const sortNotificationsByDate = () => {
        setNotifications((prev) => [...prev.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt) })]);
    }

    const getAndShowPost = async (idOfPost, idOfNotification) => {

        // nacteni prispevku ktery chceme (podle id uzivatele ifOfPost)
        const currentPost = await axios.get(changePath(`/posts/getPost/${idOfPost}`));
        setDataOfPost(currentPost.data);
        setShowPost(true);
        setShowNotifications(false);
        await setReadedToTrue(idOfNotification, false);
    }

    const setReadedToTrue = async (idOfNotification, link, senderId) => {

        var currentNotification = notifications.filter((notification) => notification._id === idOfNotification);
        !currentNotification[0].readed && setNumberOfNewNotifications(prev => prev - 1);
        console.log(currentNotification[0].readed);
        currentNotification[0].readed = true;
        setNotifications((prev) => [...prev.filter((notification) => notification._id !== idOfNotification)]);
        setNotifications((notification) => [...notification, currentNotification[0]]);
        sortNotificationsByDate();
        console.log(senderId);
        await axios.put(changePath(`/notifications/changeReadedToTrue/`), { id: idOfNotification }).then(() => {
            link == 1 ? history.push(`/profile/${senderId}`) : link === 2 && history.push(`/`);
        });
    }


    return (
        <>
            <div className="Notifications">
                {
                    showNotifications &&
                    <div className="allNotificationsContainer" style={{ backgroundColor: "white" }}>
                        {
                            notifications.map((notification) => (
                                notification.type === 4
                                    ?
                                    <div className="notificationMessagge linkNotificationToProfile opacity" style={notification.readed ? { backgroundColor: backgroundColor2, border: "1px solid" + backgroundColor1, color: backgroundColor1 } : { backgroundColor: backgroundColor1, color: backgroundColor4 }} onClick={() => setReadedToTrue(notification._id, 1, notification.senderId)}>
                                        <UserProfile friends={friends} idOfUser={notification.senderId} unReaded={!notification.readed} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                                        <span>{notification.text}</span>
                                        <span className="timeOfCreatedAtNotification">{format(notification.createdAt, 'myLanguage')}</span>
                                    </div>
                                    :
                                    notification.type === 7
                                        ?
                                        <div className="notificationMessagge linkNotificationToProfile opacity" style={notification.readed ? { backgroundColor: backgroundColor2, border: "1px solid" + backgroundColor1, color: backgroundColor1 } : { backgroundColor: backgroundColor1, color: backgroundColor4 }} onClick={() => setReadedToTrue(notification._id, 2, notification.senderId)}>
                                            <UserProfile friends={friends} idOfUser={notification.senderId} unReaded={!notification.readed} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                                            <span>{notification.text}</span>
                                            <span className="timeOfCreatedAtNotification">{format(notification.createdAt, 'myLanguage')}</span>
                                        </div>
                                        :
                                        <button className="notificationMessagge opacity" style={notification.readed ? { backgroundColor: backgroundColor2, border: "1px solid" + backgroundColor1, color: backgroundColor1, } : { backgroundColor: backgroundColor1, color: backgroundColor4 }} onClick={() => getAndShowPost(notification.idOfPost, notification._id)}>
                                            <UserProfile friends={friends} idOfUser={notification.senderId} unReaded={!notification.readed} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                                            <span>{notification.text}</span>
                                            <span className="timeOfCreatedAtNotification">{format(notification.createdAt, 'myLanguage')}</span>
                                        </button>
                            ))
                        }
                    </div>
                }
                <div className="notificationBell scaled pointer" onClick={() => setShowNotifications(prev => !prev)}>
                    {numberOfNewNotifications > 0 && <span className="notificationNubmer">{numberOfNewNotifications}</span>}
                    <HiOutlineBell style={{ color: backgroundColor1, width: "30px", height: "30px" }} />
                </div>
            </div>
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {
                    showPost &&
                    <PopupWindown classNameMain="mainContainerForPost" classNameContainer="containerForPost" setVisible={setShowPost}>
                        <Post post={dataOfPost} />
                    </PopupWindown>
                }
            </AnimatePresence>
        </>
    )
}

export default Notifications

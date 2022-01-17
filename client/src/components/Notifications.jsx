import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {HiOutlineBell} from 'react-icons/hi';
import { Link, useHistory } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import Post from './Post';
import { TiDelete } from 'react-icons/ti';
import UserProfile from './UserProfile';
import {} from 'react-router-dom';

const Notifications = ({ socket }) => {
    const { user, backgroundColor1, backgroundColor2, backgroundColor3, backgroundColor4 } = useContext(GlobalContext);

    const [notifications, setNotifications] = useState([]);

    const [numberOfNewNotifications, setNumberOfNewNotifications] = useState();

    const [showNotifications, setShowNotifications] = useState(false);

    const [showPost, setShowPost] = useState(false);
    const [dataOfPost, setDataOfPost] = useState([]);

    const history = useHistory();

    useEffect(() => {
        const setAllNotifications = async () => {
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

    const setNotificationsNewData = (data) => {
        setNumberOfNewNotifications(prev => prev + 1);
        setNotifications((notifications) => [...notifications, {_id: data.id, senderId: data.senderId, recieverId: data.recieverId, type: data.type, url: data.url, idOfPost: data.idOfPost, text: data.text, createdAt: data.date}]);
        sortNotificationsByDate();
    }

    const sortNotificationsByDate = () => {
        setNotifications((prev) => [...prev.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt)}) ]);
    }

    const getAndShowPost = async (idOfPost, idOfNotification) => {
        
        const currentPost = await axios.get(changePath(`/posts/getPost/${idOfPost}`));
        setDataOfPost(currentPost.data);
        setShowPost(true);
        setShowNotifications(false);
        await setReadedToTrue(idOfNotification, false);
    }

    const setReadedToTrue = async (idOfNotification, link, senderId) => {
        
        var currentNotification = notifications.filter((notification) => notification._id === idOfNotification);
        currentNotification[0].readed = true;
        setNotifications((prev) => [...prev.filter((notification) => notification._id !== idOfNotification)]);
        setNotifications((notification) => [...notification, currentNotification[0]]);
        setNumberOfNewNotifications(prev => prev - 1);
        sortNotificationsByDate();
        console.log(senderId);
        await axios.put(changePath(`/notifications/changeReadedToTrue/`), {id: idOfNotification}).then(() => {
            link && history.push(`/profile/${senderId}`);
        });
    }
    

    return (
        <>
            <div className="Notifications">
                {
                    showNotifications &&
                    <div className="allNotificationsContainer" style={{backgroundColor: "white"}}>
                        {
                            notifications.map(( notification ) => (
                                notification.type === 4 
                                ? 
                                <div className="notificationMessagge linkNotificationToProfile opacity" style={notification.readed ? {backgroundColor: backgroundColor2, border: "1px solid" + backgroundColor1, color: backgroundColor1} : {backgroundColor: backgroundColor1, color: backgroundColor4} } onClick={() => setReadedToTrue(notification._id, true, notification.senderId)}> <UserProfile idOfUser={notification.senderId} style={{width: "40px", height: "40px", borderRadius: "50%"}}/> <span>{notification.text}</span></div>
                                :
                                <button className="notificationMessagge opacity" style={notification.readed ? {backgroundColor: backgroundColor2, border: "1px solid" + backgroundColor1, color: backgroundColor1, } : {backgroundColor: backgroundColor1, color: backgroundColor4} } onClick={() => getAndShowPost(notification.idOfPost, notification._id)}> <UserProfile idOfUser={notification.senderId} style={{width: "40px", height: "40px", borderRadius: "50%"}}/> <span>{notification.text}</span></button>
                            ))
                        }
                    </div>
                }
                <div className="notificationBell scaled pointer" onClick={() => setShowNotifications(prev => !prev)}>
                    {numberOfNewNotifications > 0 && <span className="notificationNubmer">{numberOfNewNotifications}</span>}
                    <HiOutlineBell  style={{ color: backgroundColor1, width: "30px", height: "30px"}} />
                </div>
            </div>
            {
                showPost &&
                <div className="mainContainerForPost">
                    <div className="containerForPost">   
                        <Post post={dataOfPost} socket={socket}/>
                        <TiDelete className="removeImgShow scaled" onClick={() => setShowPost(false)} />
                    </div>
                    <div className="wallPaperNotWorking"></div>
                </div>
            }
        </>
    )
}

export default Notifications

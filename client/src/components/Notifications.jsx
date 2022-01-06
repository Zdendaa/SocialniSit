import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {HiOutlineBell} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import Post from './Post';
import { TiDelete } from 'react-icons/ti';
import UserProfile from './UserProfile';

const Notifications = ({ socket }) => {
    const { user, backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    const [showPost, setShowPost] = useState(false);
    const [dataOfPost, setDataOfPost] = useState([]);

    const arrayOfNotifications = [];


    useEffect(() => {
        const setAllNotifications = async () => {
            const allNotifications = await axios.get(changePath(`/notifications/getAllNotifications/${user._id}`)); 
            console.log(allNotifications.data)
            setNotifications(allNotifications.data);
            arrayOfNotifications.push(allNotifications.data);
            sortNotificationsByDate(allNotifications.data);
        }
        setAllNotifications();
    }, [user._id])

    useEffect(() => {
        socket?.on("getNotification", (data) => {
            console.log("new notification", data.type);

            setNotificationsNewData(data);
        })
    }, [socket])

    const setNotificationsNewData = (data) => {
       // sortNotificationsByDate();
        
       arrayOfNotifications.push([arrayOfNotifications, {senderId: data.senderId, recieverId: data.recieverId, type: data.type, url: data.url, idOfPost: data.idOfPost, text: data.text, createdAt: data.date}]);
       console.log(arrayOfNotifications);
    }

    const sortNotificationsByDate = (data) => {
        console.log(notifications)
        var sortNotifications = data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt)});
        setNotifications(sortNotifications);
    }

    const getAndShowPost = async (idOfPost) => {
        const currentPost = await axios.get(changePath(`/posts/getPost/${idOfPost}`));
        
        setDataOfPost(currentPost.data);
        setShowPost(true);
        setShowNotifications(false);
        console.log(currentPost.data);
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
                                <Link className="notificationMessagge linkNotificationToProfile opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4}} to={`/profile/${notification.senderId}`}> <UserProfile noLink={true} idOfUser={notification.senderId} style={{width: "40px", height: "40px", borderRadius: "50%"}}/> <span>{notification.text}</span></Link>
                                :
                                <button className="notificationMessagge opacity" style={{backgroundColor: backgroundColor1, color: backgroundColor4}} onClick={() => getAndShowPost(notification.idOfPost)}> <UserProfile noLink={true} idOfUser={notification.senderId} style={{width: "40px", height: "40px", borderRadius: "50%"}}/> <span>{notification.text}</span></button>
                            ))
                        }
                    </div>
                }
            
                <HiOutlineBell className="notificationBell scaled pointer" style={{ color: backgroundColor1, width: "30px", height: "30px"}} onClick={() => setShowNotifications(prev => !prev)}/>
            </div>
            {
                showPost &&
                <div className="mainContainerForPost">
                    <div className="containerForPost">   
                        <Post post={dataOfPost} />
                        <TiDelete className="removeImgShow scaled" onClick={() => setShowPost(false)} />
                    </div>
                    <div class="wallPaperNotWorking"></div>
                </div>
            }
        </>
    )
}

export default Notifications

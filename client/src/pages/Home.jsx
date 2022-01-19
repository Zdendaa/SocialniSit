import React, { useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import TopBarHome from '../components/TopBarHome';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import axios from 'axios';
import Post from '../components/Post';
import Notifications from '../components/Notifications';

const Home = ({ onlineUsers, socket }) => {
    const {user} = useContext(GlobalContext);

    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
       const getPosts = async () => {
           // nacteni postu naseho uzivatele
           const posts = await axios.get(`/posts/getAllPosts/${user._id}`)
        
           // serazeni od nejnovejsich postu po ty uplne posledni 
           const sortPosts = posts.data.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt)});
           setPosts(sortPosts);
           console.log(sortPosts)
       }
       getPosts();
    }, [user._id])
    
    useEffect(() => {
        const getFrinends = async () => {
            // nacteni pratel
            const users = await axios.get(`/users/getAllFriends/${user._id}`);
            console.log(users.data);
            setUsers(users.data);
        }
        getFrinends();
     }, [user._id])
    
    
    return (
        <div className="homeContainer">           
             <TopBarHome socket={socket}/>

             <SwiperOnlineFriends users={users} onlineUsers={onlineUsers} type={1}/>

             <div className="homeContainerPostsMain">
                <div className="homeContainerPosts">
                    <AddNewPost socket={socket} friends={users}/>
                    {
                        posts?.map((post, index) => (
                            <Post post={post} key={index} socket={socket}/> 
                        ))
                    }
                </div>
                <SwiperOnlineFriends users={users} onlineUsers={onlineUsers} className="pc" type={2}/>
             </div>
             <Notifications socket={socket}/>
        </div>
    )
}

export default Home

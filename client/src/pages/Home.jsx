import React, { useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import TopBarHome from '../components/TopBarHome';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import axios from 'axios';
import Post from '../components/Post';
import { io } from "socket.io-client";

const Home = () => {
    const {user} = useContext(GlobalContext);

    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState([]);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const socket = useRef();

    useEffect(() => {
        // pripojeni socket.io
        socket.current = io("ws://localhost:8900");
    }, [])
    
    useEffect(() => {
        // zavolani socket.io addUser a poslani hodnoty user.id
        socket.current.emit("addUser", user._id);
        // dostani vsech online uzivatelu
        socket.current.on("getUsers", users => {
            setOnlineUsers(users.filter(onlineUser => onlineUser.userId !== user._id));
        })
    }, [user])

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
             <TopBarHome />

             <SwiperOnlineFriends users={users} onlineUsers={onlineUsers} type={1}/>

             <div className="homeContainerPostsMain">
                <div className="homeContainerPosts">
                    <AddNewPost />    
                    {
                        posts?.map((post, index) => (
                            <Post post={post} key={index}/> 
                        ))
                    }
                </div>
                <SwiperOnlineFriends users={users} onlineUsers={onlineUsers} className="pc" type={2}/>
             </div>
        </div>
    )
}

export default Home

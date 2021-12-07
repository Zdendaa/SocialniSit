import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalState';
import TopBarHome from '../components/TopBarHome';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import axios from 'axios';
import Post from '../components/Post';


const Home = () => {
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

             <SwiperOnlineFriends users={users}  type={1}/>

             <div className="homeContainerPostsMain">
                <div className="homeContainerPosts">
                    <AddNewPost />    
                    {
                        posts?.map((post, index) => (
                            <Post post={post} key={index}/> 
                        ))
                    }
                </div>
                <SwiperOnlineFriends users={users} className="pc" type={2}/>
             </div>
        </div>
    )
}

export default Home

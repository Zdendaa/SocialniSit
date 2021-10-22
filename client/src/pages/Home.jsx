import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { GlobalContext } from '../context/GlobalState';
import TopBarHome from '../components/TopBarHome';
import SwiperOnlineFriends from '../components/SwiperOnlineFriends';
import AddNewPost from '../components/AddNewPost';
import axios from 'axios';




const Home = () => {
    const {deleteUser} = useContext(GlobalContext);
    const history = useHistory();
    const [posts, setPosts] = useState(null);

    useEffect(() => {
       const getPosts = async () => {
           const posts = await axios.get("/posts/getAllPosts")
           setPosts(posts.data);
       }
       getPosts();
    }, [])
    
    
    return (
        <div className="homeContainer">           
             <TopBarHome />
             <button onClick={ () => { 
                localStorage.removeItem("user");
                deleteUser();
                history.push("/register");
                
             } }>log out</button>
             <SwiperOnlineFriends />
             <div className="homeContainerPosts">
                <AddNewPost />    
                {
                    posts?.map((post, index) => (
                        <div key={index}>
                            {post.desc}
                        </div>  
                    ))
                }
             </div>
        </div>
    )
}

export default Home

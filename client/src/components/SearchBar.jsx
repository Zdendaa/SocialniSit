import React, { useContext, useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import changePath from '../changePath';
import axios from 'axios';
import UserProfile from '../components/UserProfile';
import { FiX } from 'react-icons/fi';
import { GlobalContext } from '../context/GlobalState';

const SearchBar = () => {
    const { backgroundColor1 } = useContext(GlobalContext);

    const [isTyping, setIsTyping] = useState(false);

    const [users, setUsers] = useState([]);

    const searchUsers = async (value) => {
        if(value === "") {
            setUsers([])
        } else {
            const newUsers = await axios.get(changePath(`/users/getSearchPeople/${value}`));
            setUsers(newUsers.data);
        }
    }
    return (
        <div>
            <BiSearchAlt className={isTyping ? "none" : "searchIcon scaled pointer"} onClick={() => setIsTyping(!isTyping)}/>
            <div className={isTyping ? "resultSearchContainer" : "none"}>
                <input onChange={(e) => searchUsers(e.target.value)} type="text" className="searchBarInput" placeholder="vyhledejte uživatelé..." style={isTyping ? {width: "250px"} : {width: "0px"}}/>
                <FiX onClick={() => setIsTyping(!isTyping)} className="stopSearchPeople scaled pointer" style={{color: backgroundColor1}}/>
                
                <div style={{position: "absolute", width: "250px", top: "50px", padding: "5px", backgroundColor: "white"}}>
                {
                    users?.map(user => (
                        <div style={{margin: "6px"}}>
                            <UserProfile idOfUser={user._id} key={user._id} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}/>
                        </div>
                    ))
                }
                </div>
               
            </div>
        </div>
    )
}

export default SearchBar

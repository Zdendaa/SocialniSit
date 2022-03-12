import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import changePath from "../changePath";
import Chat from "../components/Chat";
import TopBarHome from "../components/TopBarHome";
import UserChat from "../components/UserChat";
import { GlobalContext } from "../context/GlobalState";

const Messenger = () => {
    const { user } = useContext(GlobalContext);
    const { idOfUser, idOfChat } = useParams();
    const [chats, setChats] = useState(null);
    const [searchChats, setsearchChats] = useState([]);

    const [users, setUsers] = useState(null);
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const getFrinends = async () => {
            // nacteni chatu
            const chats = await axios.get(`/chats/getAllChats/${user._id}`);
            const chatsData = chats.data;

            //  nacteni uzivatelu
            const usersIdData = [];
            chatsData.forEach(chat => {
                if (chat.usersId.length === 2) {
                    chat.usersId[0] === user._id ? usersIdData.push(chat.usersId[1]) : usersIdData.push(chat.usersId[0]);
                }
            });

            const uniqueUsersIdData = [...new Set(usersIdData)]; // odstraneni duplicitnich hodnot (id uzivatelu)
            const usersIdChatData = await axios.post(changePath(`/users/getAllUsersData`), { users: uniqueUsersIdData }); // nacteni dat vsech vlastniku postu
            setUsers(usersIdChatData.data);
            setChats(chatsData);
            setsearchChats(chatsData);
        }
        getFrinends();
    }, [user._id])

    useEffect(() => {
        const getCurrentUser = async () => {
            // nacteni uzivatele vlastnika chatu jestli ho uz nemame nacteneho 
            if (idOfUser !== user?._id && !users?.filter(user => user?._id === idOfUser)) {
                const newUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
                setUsers(() => [users, newUser.data]);
            }
            setCurrentUser(users?.filter(user => user?._id === idOfUser)[0]);
        }
        getCurrentUser();
    }, [idOfUser, users])



    const searchChat = (val) => {
        const findUsers = users.filter(user => user.username.toLowerCase().includes(val.toLowerCase()));

        const newArrayOfChat = [];
        chats.forEach((chat) => {
            findUsers.forEach((user) => {
                if (chat.usersId.includes(user._id)) {
                    newArrayOfChat.push(chat);
                }
            })
        })
        setsearchChats(newArrayOfChat);
    }

    return (
        <div className="messengerContainer">
            <TopBarHome />
            <div className="messengerMain">
                <div className={idOfUser !== user._id ? "messengerFriends mobileDiplayNone" : "messengerFriends"}>
                    <input type="text" className="searchChat" placeholder="hledej chaty..." onChange={(e) => { searchChat(e.target.value) }} />
                    {
                        searchChats?.map(chat => (
                            <UserChat users={users} chat={chat} key={chat._id} />
                        ))
                    }
                </div>
                {idOfUser !== user._id && < Chat userOfChat={currentUser} idOfChat={idOfChat} />}
            </div>
        </div>
    );
};

export default Messenger;

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
    const [currentUser, setCurrentUser] = useState(null);

    const [idOfChat2, setIdOfChat2] = useState();

    useEffect(() => {
        const sortChats = chats?.sort((p1, p2) => { return new Date(p2.lastMessageTime) - new Date(p1.lastMessageTime) });
        setsearchChats(sortChats);
    }, [chats])


    useEffect(() => {
        const getFrinends = async () => {
            // nacteni chatu
            const chats = await axios.get(changePath(`/chats/getAllChats/${user?._id}`));
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
    }, [idOfChat])

    useEffect(() => {
        const getCurrentUser = async () => {
            // nacteni uzivatele vlastnika chatu jestli ho uz nemame nacteneho 
            if (idOfUser !== user?._id && !users?.filter(user => user?._id === idOfUser)[0]) {
                const newUser = await axios.get(changePath(`/users/getUser/${idOfUser}`));
                setUsers(() => [users, newUser.data]);
                setCurrentUser(newUser.data)
            } else {
                setCurrentUser(users?.filter(user => user?._id === idOfUser)[0]);
            }
        }
        getCurrentUser();
    }, [idOfUser])

    useEffect(() => {
        if (idOfChat === '0' && idOfUser !== user._id) {
            chats?.forEach(chat => {
                if (chat.usersId.some(id => id === idOfUser)) {
                    setIdOfChat2(chat._id);
                }
            })
        } else {
            setIdOfChat2(null);
        }
    }, [idOfChat, chats, idOfUser])

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

    //    const sortChatsByDate = () => {
    //         setChats(chats => chats?.sort((p1, p2) => { return new Date(p2.lastMessageTime) - new Date(p1.lastMessageTime) }));
    //     } 

    return (
        <div className="messengerContainer">
            <TopBarHome />
            <div className="messengerMain">
                <div className={idOfUser !== user._id ? "messengerFriends mobileDiplayNone" : "messengerFriends"}>
                    <input type="text" className="searchChat" placeholder="hledej chaty..." onChange={(e) => { searchChat(e.target.value) }} />
                    {
                        searchChats?.map(chat => (
                            <UserChat chats={chats} setChats={setChats} users={users} chat={chat} key={chat._id} idOfActiveChat={(idOfChat2 && idOfChat == '0') ? idOfChat2 : idOfChat} />
                        ))
                    }
                </div>
                {idOfUser !== user._id && < Chat chats={chats} setChats={setChats} userOfChat={currentUser} idOfChat={(idOfChat2 && idOfChat == '0') ? idOfChat2 : idOfChat} />}
                {idOfUser === user._id && <div className="mobileDiplayNone chatNone" ><h3>není vybrán žádný chat</h3></div>}
            </div>
        </div>
    );
};

export default Messenger;

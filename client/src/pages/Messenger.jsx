import axios from "axios";
import { useContext, useEffect, useState } from "react";
import changePath from "../changePath";
import TopBarHome from "../components/TopBarHome";
import UserChat from "../components/UserChat";
import { GlobalContext } from "../context/GlobalState";

const Messenger = () => {
    const { user } = useContext(GlobalContext);

    const [infoAboutChat, setInfoAboutChat] = useState(null);

    const [users, setUsers] = useState(null);

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
            setInfoAboutChat(chatsData);
        }
        getFrinends();
    }, [user._id])

    return (
        <div className="messengerContainer">
            <TopBarHome />
            <div className="messengerMain">
                <div className="messengerFriends">
                    <input type="text" className="searchChat" placeholder="hledej chaty..." />
                    {
                        infoAboutChat?.map(chat => (
                            <UserChat users={users} chat={chat} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Messenger;

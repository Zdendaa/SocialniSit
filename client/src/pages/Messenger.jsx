import axios from "axios";
import { useContext, useEffect, useState } from "react";
import SwiperOnlineFriends from "../components/SwiperOnlineFriends";
import TopBarHome from "../components/TopBarHome";
import { GlobalContext } from "../context/GlobalState";

const Messenger = () => {
    const { user } = useContext(GlobalContext);

    const [nuberOfChat, setNuberOfChat] = useState(null);

    const [users, setUsers] = useState(null);

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
        <div className="messengerContainer">
            <TopBarHome />

            <div className="messengerMain">
                <div className="messengerFriends">
                   <SwiperOnlineFriends users={users} />
                </div>
                <div className="messages">
                    {nuberOfChat ? <p>jedeeem</p> : <p>není vybrán žádný chat</p>}
                </div>
            </div>
        </div>
    );
};

export default Messenger;

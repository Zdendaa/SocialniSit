import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import UserProfile from './UserProfile'

const ProfileRequests = ({idOfRequests, confirmRequest, myId}) => {

    const {backgroundColor1} = useContext(GlobalContext);
    return (
        <div className="requestsContainer">
            {
                idOfRequests.map(id => (
                    <div className="requests" key={id}>
                        <UserProfile idOfUser={id} style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}} />
                        <button onClick={() => confirmRequest(id)} style={{backgroundColor: backgroundColor1}} className="buttonConfirmFriendShip">přijmout žádost o přátelství</button>
                    </div>
                ))
            }
        </div>
    )
}

export default ProfileRequests

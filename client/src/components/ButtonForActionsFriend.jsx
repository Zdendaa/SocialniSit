import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'

const ButtonForActionsFriend = ({removeFriend, ifAreFriends, myUser, idOfUser, addOrRemoveRequestToUser, ifSendRequest, confirmRequest}) => {
    const {backgroundColor1} = useContext(GlobalContext);
    return (
        <>
            {
            ifAreFriends 
            ? 
            <button className="buttonForActionsFriend" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={removeFriend}>odebrat přítele</button> 
            :
            myUser?.idOfRequests.includes(idOfUser)
            ? 
            <button className="buttonForActionsFriend" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={() => confirmRequest(idOfUser)}>přijmout žádost</button> 
            : 
            <button className="buttonForActionsFriend" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={addOrRemoveRequestToUser}>{ifSendRequest ? "odebrat žádost" : "poslat žádost"}</button>
            }
        </>
    )
}

export default ButtonForActionsFriend

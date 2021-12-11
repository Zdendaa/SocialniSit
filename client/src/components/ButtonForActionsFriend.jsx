import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import {IoMdRemove, IoMdAdd, IoMdCheckmark, IoMdClose} from 'react-icons/io';

const ButtonForActionsFriend = ({removeFriend, ifAreFriends, myUser, idOfUser, addOrRemoveRequestToUser, ifSendRequest, confirmRequest}) => {
    const {backgroundColor1} = useContext(GlobalContext);
    return (
        <>
            {
            ifAreFriends 
            ?  
            <button className="buttonForActionsFriend opacity" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={removeFriend}><IoMdClose style={{fontSize: "20px"}}/>odebrat přítele</button> 
            :
            myUser?.idOfRequests?.includes(idOfUser)
            ? 
            <button className="buttonForActionsFriend opacity" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={() => confirmRequest(idOfUser ,myUser._id)}><IoMdCheckmark style={{fontSize: "20px"}}/>přijmout žádost</button> 
            : 
            <button className="buttonForActionsFriend opacity" style={{backgroundColor: backgroundColor1, color: "white"}} onClick={addOrRemoveRequestToUser}>{ifSendRequest ? (<><IoMdRemove style={{fontSize: "20px"}} /> odebrat žádost</>) : <><IoMdAdd style={{fontSize: "20px"}}/>poslat žádost</> }</button>
            }
        </>
    )
}

export default ButtonForActionsFriend

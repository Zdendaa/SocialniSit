import React from 'react'
import ButtonForActionsFriend from './ButtonForActionsFriend'

const TopProfile = ({url, user, removeFriend, ifAreFriends, myUser, idOfUser, addOrRemoveRequestToUser, ifSendRequest, confirmRequest}) => {
    return (
        <div className="topProfile" style={idOfUser !== user._id ? {marginBottom: "50px"} : {}}>
            <img className="topProfileBackgroundPicture" src={"/img/wallpaperNone.jpg"} alt=""/>
            <img className="topProfileProfilePicture" src={url ? url : "/img/anonymous.png"} alt="" />
            
            { 
            idOfUser === user._id &&
            (
                <div className="bottomProfile">
                    <span>{user.username}</span>
                    <ButtonForActionsFriend removeFriend={removeFriend} ifAreFriends={ifAreFriends} myUser={myUser} idOfUser={idOfUser} addOrRemoveRequestToUser={addOrRemoveRequestToUser} ifSendRequest={ifSendRequest} confirmRequest={confirmRequest} />                 
                </div>
            )
            }
        </div>
    )
}

export default TopProfile

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { format } from 'timeago.js';
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Comment = ({comment, addComment, commentMain}) => {

    const {user, backgroundColor1, backgroundColor2} = useContext(GlobalContext);

    // promenna ktera resi zda jsou komentare videt
    const [show, setShow] = useState(false);

    // promenna ve ktere je ulozen text inputu
    const [valueOfInput, setValueOfInput] = useState("");

    // promenna vlastnika komentare
    const [userOfComment, setUserOfComment] = useState([]);

    // promenna zdali jsem komentar likenul
    const [ifIsLiked, setIfIsLiked] = useState(comment.idOfLikes.includes(user._id));

    // promenna pro pocet liku
    const [lenghtOfLikes, setLenghtOfLikes] = useState(comment.idOfLikes.length);

    // promenna zda uzivatel kliknul na talickto pridej komentar a stranka se nacita
    const [ifLoading, setifLoading] = useState(false);

    // ulozeni vsech deti tohoto komentare do promenne nestedComments
    const nestedComments = (comment.children || []).map((comment1) => {
        return <Comment comment={comment1} commentMain={commentMain} addComment={addComment} key={comment1._id} />;
    });

    useEffect(() => {
        const getUserOfComment = async () => {
            const userOfCommnent = await axios.get(changePath(`/users/getUser/${comment.idOfUser}`));
            setUserOfComment(userOfCommnent.data);
        }
        getUserOfComment();
    }, [comment.idOfUser])

    // pridani nebo odebrani likeu
    const addOrRemoveLike = async () => {
        // zmena promenne ifIsLiked
        ifIsLiked ? setLenghtOfLikes(lenght => lenght - 1) : setLenghtOfLikes(lenght => lenght + 1);
        setIfIsLiked(!ifIsLiked);
        // pridani nebo odebrani likeu v databazi
        await axios.put(changePath(`/comments/addOrRemoveLike/${comment._id}/${user._id}`));
        
    }

    const prepareToAddComment = () => {
        setifLoading(true);
        addComment(valueOfInput, comment._id, user._id).then(() => {
            setValueOfInput("");
            setifLoading(false);
        })
    }
    
    return (
        <div className="comment">
            <div className="userCommentContainer">
                <div className="userCommentTop">
                    <Link to={`/profile/${userOfComment._id}`} style={{display: 'flex', alignItems: "center", textDecoration: "none", color: "black", marginRight: "8px"}}>
                        <img className="imgUserComment" src={userOfComment.idOrUrlOfProfilePicture ? userOfComment.idOrUrlOfProfilePicture : "img/anonymous.png"} alt="" referrerPolicy="no-referrer"/>
                        <span>{userOfComment.username}</span>
                    </Link>
                    <span>{format(comment.createdAt, 'myLanguage')}</span>
                </div>
                <div className="userCommentMid">
                    <span>{comment.value}</span>
                </div>
                <div className="userCommentBottom">
                    <span>{ifIsLiked ? <FcLike style={{fontSize: "25px"}} className="scaled" onClick={addOrRemoveLike} /> : <FcLikePlaceholder style={{fontSize: "25px"}} className="scaled" onClick={addOrRemoveLike} /> }{lenghtOfLikes}</span>
                    <span onClick={() => setShow(!show)}>počet odpovědí {comment.children ? comment.children.length : "0"}</span>
                </div>
                
                
            </div>
            {show && 
                <div className="commentsContainer">
                    
                    <div className="addComment">
                        <input className="addCommentInput" style={{backgroundColor: backgroundColor2}} type="text" value={valueOfInput} onChange={(e) => setValueOfInput(e.target.value)} placeholder="co máš na mysli..." />
                        <button className="addCommentButton" style={{backgroundColor: backgroundColor1}} onClick={prepareToAddComment}>{!ifLoading ? "přidej komentář" : <ClipLoader color={backgroundColor2} size={10} />}</button>
                    </div>
                    <ul>
                        {nestedComments}
                    </ul>
                </div>
            }
            
        </div>
    )
}

export default Comment

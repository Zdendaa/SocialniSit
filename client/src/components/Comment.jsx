import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { getUrlImgOrNull } from '../storageImgActions/imgFunctions';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { format } from 'timeago.js';

const Comment = ({comment, addComment, commentMain}) => {

    const {user, backgroundColor1, backgroundColor2} = useContext(GlobalContext);

    // promenna ktera resi zda jsou komentare videt
    const [show, setShow] = useState(false);

    // promenna ve ktere je ulozen text inputu
    const [valueOfInput, setValueOfInput] = useState("");

    // promenna vlastnika komentare
    const [userOfComment, setUserOfComment] = useState([]);

    // promenna pro zobrazeni profilove fotky uzivatele
    const [url, setUrl] = useState(null);

    // promenna zdali jsem komentar likenul
    const [ifIsLiked, setIfIsLiked] = useState(comment.likes.includes(user._id));

    // promenna pro pocet liku
    const [lenghtOfLikes, setLenghtOfLikes] = useState(comment.likes.length);

    // ulozeni vsech deti tohoto komentare do promenne nestedComments
    const nestedComments = (comment.children || []).map((comment1) => {
        return <Comment comment={comment1} commentMain={commentMain} addComment={addComment} key={comment1._id} />;
    });

    useEffect(() => {
        const getUserOfComment = async () => {
            const userOfCommnent = await axios.get(changePath(`/users/getUser/${comment.idOfUser}`));
            setUserOfComment(userOfCommnent.data);
            // dostani url obrazku uzivatele
            setUrl(await getUrlImgOrNull(userOfCommnent.data));
        }
        getUserOfComment();
    }, [])

    // pridani nebo odebrani likeu
    const addOrRemoveLike = async () => {
        /*
        ifIsLiked ? setLenghtOfLikes(lenght => lenght - 1) : setLenghtOfLikes(lenght => lenght + 1);
        setIfIsLiked(!ifIsLiked);
        await axios.put(changePath(`/posts/addOrRemoveLike/${post._id}`), { userId: user._id })
        */
    }

    

    

    return (
        <div className="comment">
            <div className="userCommentContainer" onClick={() => setShow(!show)}>
                <img className="imgUserComment" src={userOfComment.idOrUrlOfProfilePicture ? url : "img/anonymous.png"} alt="" />
                <p>{userOfComment.username}</p>
                <span>{comment.value}</span>
                {ifIsLiked ? <FcLike style={{fontSize: "25px"}} onClick={addOrRemoveLike} /> : <FcLikePlaceholder style={{fontSize: "25px"}} onClick={addOrRemoveLike} /> }{lenghtOfLikes}
                <span>{format(comment.createdAt, 'myLanguage')}</span>
                <span></span>
            </div>
            {show && 
                <div className="commentsContainer">
                    
                    <div className="addComment">
                        <input className="addCommentInput" style={{"background-color": backgroundColor2}} type="text" value={valueOfInput} onChange={(e) => setValueOfInput(e.target.value)} placeholder="co máš na mysli..." />
                        <button className="addCommentButton" style={{"background-color": backgroundColor1}} onClick={() => addComment(valueOfInput, comment._id, user._id)}>přidej komentář</button>
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

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import Comment from './Comment';
import ClipLoader from "react-spinners/ClipLoader";

const Comments = ({post}) => {
    const {user, backgroundColor1, backgroundColor2} = useContext(GlobalContext);

    // promenna pro vsechny komentare pro tenhle prispevek
    const [comments, setComments] = useState([]);

    // promenna ktera resi zda jsou komentare videt
    const [show, setShow] = useState(false);

    // promenna ve ktere je ulozen text inputu
    const [valueOfInput, setValueOfInput] = useState("");

    // promenna ktera ma ulozene komentare s spravne vnoreneme komentarema v children
    const [allComments, setAllComments] = useState([]);

    // promenna zda uzivatel kliknul na talickto pridej komentar a stranka se nacita
    const [ifLoading, setifLoading] = useState(false);

    useEffect(() => {
        // najde vsechny komentare vztazene k nasemu prispevku
        const getAllComments = async () => {
            const newComments = await axios.get(changePath(`/comments/getComments/${post._id}`));
            setComments(newComments.data);
        }
        getAllComments();
    }, [post._id]);

    useEffect(() => {
      
        const nestComments = (commentList) => {
          // serazeni komentaru od nejnovejsiho po nejstarsiho
          commentList = commentList.sort((p1, p2) => { return new Date(p2.createdAt) - new Date(p1.createdAt)});
          const commentMap = {};
  
          // vsechny komenty se ulozi do commentMap kde jsou indexy jako id
          commentList.forEach(comment => commentMap[comment._id] = comment);
          // do komentaru vnorime deti komenatre (komentare ktere patri hlvanimu komentari)
          commentList.forEach(comment => {
            if(comment.idOfparentComment !== null) {
              const parent = commentMap[comment.idOfparentComment];
              (parent.children = parent.children || []).push(comment);
            }
          });
          // filtrujeme seznam komentaru na hlavni komentare
          return commentList.filter(comment => comment.idOfparentComment === null);
          
        }
        setAllComments(nestComments(comments));
      }, [comments]);

    
    // funkce
    
    // prida komentar
    const addComment = async (valueOfInput, idOfparentComment, idOfUser) => {
        try {
          setifLoading(true);
          const newComment = {
            value: valueOfInput,
            idOfPost: post._id,
            idOfparentComment: idOfparentComment,
            idOfUser: idOfUser
          }
          // pridame do promenne comments novy komentar
          await axios.post(changePath("/comments/addComment"), newComment);
          // dostaneme vsechny komentare vztazene k prispevku
          const newComments = await axios.get(changePath(`/comments/getComments/${post._id}`));
          setComments(newComments.data);
          setifLoading(false);
          setValueOfInput("");
          return true
        } catch (err) {
          return false;
        }
        
    }

    return (
        <div>
            <span onClick={() => setShow(!show)}>počet komentářů {comments.length} {show ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>

            {show && 
                <div className="commentsContainer">
                    <div className="addComment">
                      <input className="addCommentInput" style={{backgroundColor: backgroundColor2}} type="text" value={valueOfInput} onChange={(e) => setValueOfInput(e.target.value)}placeholder="co máš na mysli..." />
                      <button className="addCommentButton" style={{backgroundColor: backgroundColor1}} onClick={() => addComment(valueOfInput, null, user._id)}>{!ifLoading ? "přidej komentář" : <ClipLoader color={backgroundColor2} size={10} />}</button>
                    </div>
                        {   
                          allComments.map(comment => (
                            <>
                            <Comment comment={comment} commentMain={comment} addComment={addComment} key={comment._id} />
                            </>
                          ))
                        }
                </div>
            }
          
        </div>
    )
}

export default Comments

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Comment from './Comment';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Comments = ({post}) => {
    // promenna pro vsechny komentare pro tenhle prispevek
    const [comments, setComments] = useState([]);

    // promenna ktera resi zda jsou komentare videt
    const [show, setShow] = useState(false);

    // promenna ve ktere je ulozen text inputu
    const [valueOfInput, setValueOfInput] = useState("");

    useEffect(() => {
        getAllComments();
    }, []);

    const getAllComments = async () => {
        const comments = await axios.get(`/comments/getComments/${post._id}`);
        setComments(comments.data);
    }

    // funkce
    const addComment = async () => {
        const newComment = {
            value: valueOfInput,
            idOfPost: post._id,
        }
        await axios.post("/comments/addComment", newComment);
        await getAllComments();
    }

    return (
        <div>
            <span onClick={() => setShow(!show)}>počet komentářů {comments.length} {show ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
            {show && 
                <div className="commentsContainer">
                <input type="text" value={valueOfInput} onChange={(e) => setValueOfInput(e.target.value)}placeholder="co máš na mysli..." />
                <button onClick={addComment}>přidej komentář</button>
                {comments.map((comment, index) => (
                    <Comment key={index} comment={comment} />
                ))}
                </div>
            }
          
        </div>
    )
}

export default Comments

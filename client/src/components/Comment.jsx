import React from 'react'


const Comment = ({comment}) => {
    return (
        <div className="comment">
            {comment.value}
        </div>
    )
}

export default Comment

import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState';

const UploadControl = ({ children, setUrlImage, id, setNoError, addStory }) => {
    const { backgroundColor1 } = useContext(GlobalContext);
    return (
        <label htmlFor={id} id="inputfileRegister" className={`${!addStory && "inputImgAddPost"} opacity`} style={addStory ? { color: "white", margin: "10px 0px 10px 0px" } : { backgroundColor: backgroundColor1, color: "white", margin: "10px 0px 10px 0px" }} >
            <input
                style={{ display: 'none' }}
                id={id}
                type="file"
                onChange={(e) => { e.target.files[0] && setUrlImage(URL.createObjectURL(e.target.files[0])); setNoError(false) }}
                accept="image/*"
            />
            {children}
        </label>
    )
}

export default UploadControl

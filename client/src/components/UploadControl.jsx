import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState';

const UploadControl = ({children, setUrlImage, id, setNoError}) => {
    const { backgroundColor1 } = useContext(GlobalContext);
    return (
        <label htmlFor={id} id="inputfileRegister" className="inputImgAddPost opacity" style={{ backgroundColor: backgroundColor1, color: "white", margin: "15px 0px 15px 0px" }} >
            <input
                style={{ display: 'none' }}
                id={id}
                type="file"
                onChange={ (e) => { e.target.files[0] && setUrlImage(URL.createObjectURL(e.target.files[0])); setNoError(false) } } 
                accept="image/*"
            />
            {children}
        </label>
    )
}

export default UploadControl

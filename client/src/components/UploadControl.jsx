import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState';

const UploadControl = ({children, setUrlImage, id}) => {
    const { backgroundColor1 } = useContext(GlobalContext);
    return (
        <label htmlFor={id} id="inputfileRegister" className="inputImgAddPost" style={{ backgroundColor: backgroundColor1, color: "white", margin: "15px 0px 15px 0px" }} >
            <input
                style={{ display: 'none' }}
                id={id}
                type="file"
                onChange={ (e) => setUrlImage(URL.createObjectURL(e.target.files[0])) } 
            />
            {children}
        </label>
    )
}

export default UploadControl

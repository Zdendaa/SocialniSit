import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalState';
import { MdInsertPhoto } from 'react-icons/md';

const PhotoMessage = ({ setPhotoFile }) => {
    const { backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [image, setImage] = useState();
    const onUpload = async (file) => {
        setImage(file);
        setPhotoFile(file);
    }
    return (
        <>
            <label htmlFor="photoFileUpload" id="inputfileRegister" className="buttonsForVariantsMessage" style={{ color: backgroundColor4, backgroundColor: backgroundColor1 }} >
                <MdInsertPhoto />
            </label>
            <input id="photoFileUpload" key={image || ''} type="file" accept='image/*' onChange={(e) => { onUpload(e.target.files[0]) }} hidden />
        </>
    )
}

export default PhotoMessage
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalState';
import { ImVideoCamera } from 'react-icons/im';

const VideoMessage = ({ setVideoFile }) => {
    const { backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [file, setFile] = useState();
    const onUpload = async (file) => {
        setFile(file);
        setVideoFile(file);
    }
    return (
        <>
            <label htmlFor="videoFileUpload" id="inputfileRegister" className="buttonsForVariantsMessage" style={{ color: backgroundColor4, backgroundColor: backgroundColor1 }} >
                <ImVideoCamera />
            </label>
            <input id="videoFileUpload" key={file || ''} type="file" accept="video/*" onChange={(e) => { onUpload(e.target.files[0]) }} hidden />
        </>
    )
}

export default VideoMessage
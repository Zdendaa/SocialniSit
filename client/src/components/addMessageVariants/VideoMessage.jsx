import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalState';
import { ImVideoCamera } from 'react-icons/im';

const VideoMessage = () => {
    const { backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [file, setFile] = useState();
    return (
        <>
            <label htmlFor="videoFileUpload" id="inputfileRegister" className="buttonsForVariantsMessage" style={{ color: backgroundColor4, backgroundColor: backgroundColor1 }} >
                <ImVideoCamera />
            </label>
            <input id="videoFileUpload" key={file || ''} type="file" accept="video/*" onChange={(e) => { setFile(e.target.files[0]) }} hidden />
        </>
    )
}

export default VideoMessage
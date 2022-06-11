import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import changePath from '../../changePath';
import { GlobalContext } from '../../context/GlobalState';
import UploadControl from '../UploadControl';
import ClipLoader from "react-spinners/ClipLoader";
import { GoCheck } from 'react-icons/go';
import { MdInsertPhoto } from 'react-icons/md';
import VideoMessage from '../addMessageVariants/VideoMessage';

const CropperImage = ({ aspect, rect, saveImg, addStory, children, setCropImg, setVideo, video }) => {
    const { user, backgroundColor1, backgroundColor4, socket } = useContext(GlobalContext);

    const [crop, setCrop] = useState({ aspect });

    const [urlImage, setUrlImage] = useState(null);

    const [image, setImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // zda se nenastala zadna chyba
    const [noError, setNoError] = useState(false);

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const getFrinends = async () => {
            // nacteni pratel
            const users = await axios.get(`/users/getAllFriends/${user._id}`);
            setFriends(users.data);
        }
        getFrinends();
    }, [user._id])

    useEffect(() => {
        setUrlImage(null);
    }, [video])

    const sendNotification = async (recieverId, type, url, idOfPost, text) => {
        // pridani notifikace do db
        console.log("ahoj");
        const newNotificatons = await axios.post(changePath(`/notifications/addNotification`), { senderId: user._id, recieverId, type, url, idOfPost, text });
        // pridani notifikace do socket.io serveru
        socket.emit("sendNotification", { id: newNotificatons.data._id, senderId: user._id, recieverId, type, url, idOfPost, readed: false, text });
    }

    const getCroppedImg = async (onlyCrop) => {
        if (!image || (crop.width === 0 && crop.height === 0)) return;
        // vytvoreni canvasu
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        if (onlyCrop) {
            const base64Image = canvas.toDataURL("image/jpeg");
            setCropImg(base64Image);
        }
        else {
            canvas.toBlob(async (blob) => {
                blob.name = Math.floor(Date.now() / 1000);
                setUrlImage(null);
                await saveImg(blob, setNoError, setIsLoading, friends, sendNotification, 1);
            });
        }
    }

    const addVideo = async () => {
        setUrlImage(null);
        await saveImg(video, setNoError, setIsLoading, friends, sendNotification, 2);
    }

    return (
        <div className="CropperImage">
            <div className='actionsMethods'>
                <UploadControl addStory={addStory} setUrlImage={setUrlImage} setNoError={setNoError} id={rect ? "addCoverPicture" : "addProfilePicture"}>
                    {addStory
                        ?
                        <div id="inputfileRegister" className="buttonsForVariantsMessage opacity" style={{ color: backgroundColor4, backgroundColor: backgroundColor1 }} >
                            <MdInsertPhoto className='reactIcon' />
                        </div>
                        :
                        <span className="opacity" style={{ color: backgroundColor4 }}>vyber obrázek</span>
                    }
                </UploadControl>
                {addStory && <VideoMessage setVideoFile={setVideo} />}
            </div>

            {

                urlImage && (
                    <>
                        {
                            addStory ?
                                <ReactCrop src={urlImage}
                                    onImageLoaded={setImage}
                                    crop={crop}
                                    onChange={newCrop => { setCrop(newCrop); getCroppedImg(true) }}
                                    style={{ minWidth: "120px", maxWidth: "240px", minHeight: "150px", maxHeight: "300px", objectFit: "cover" }}
                                >
                                    {children}
                                </ReactCrop>
                                :
                                rect ? (
                                    <ReactCrop src={urlImage}
                                        onImageLoaded={setImage}
                                        crop={crop}
                                        onChange={newCrop => setCrop(newCrop)}
                                        style={{ width: "80%", height: "auto" }}
                                    />
                                ) :
                                    (
                                        <ReactCrop src={urlImage}
                                            onImageLoaded={setImage}
                                            crop={crop}
                                            onChange={newCrop => setCrop(newCrop)}
                                            style={{ width: "250px", height: "auto" }}
                                            circularCrop
                                        />
                                    )
                        }

                    </>
                )
            }
            <button onClick={() => !isLoading && (urlImage ? getCroppedImg() : video && addVideo())} className="inputImgAddPost opacity" style={{ backgroundColor: backgroundColor1, color: backgroundColor4, margin: "10px 0px 0px 0px" }} >{!isLoading ? (noError ? <div className="correctAnimation"><GoCheck size={15} /></div> : (addStory ? "přidat příběh" : rect ? "změnit fotku na pozadí" : "změnit profilovou fotku")) : <ClipLoader color={backgroundColor4} size={10}></ClipLoader>}</button>
        </div >

    )
}


export default CropperImage

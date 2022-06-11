import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import changePath from '../changePath';
import PopupWindown from './global/PopupWindown';

const ImagesOfUser = ({ user }) => {
    const [urlOfImages, setUrlOfImages] = useState([]);

    const [openPopupWidnown, setOpenPopupWidnown] = useState(false);
    const [urlOfChoseImg, setUrlOfChoseImg] = useState(null);

    useEffect(() => {
        // nacteni url vsech obrazku uzivatele
        const getUrlOfImages = async () => {
            setUrlOfImages([]);
            await user?.idOfAllPicture?.map(async (idOfImage) => {
                const image = await axios.get(changePath(`/images/getImg/${idOfImage}`));
                const dataOfImage = image.data;

                setUrlOfImages(data => [...data, dataOfImage.url]);
            })
        }
        getUrlOfImages();
    }, [user.idOfAllPicture]);

    const openPopupWindownImg = (idOfImage) => {
        setOpenPopupWidnown(true);
        setUrlOfChoseImg(idOfImage);
    }

    return (
        <div className="profileImages">
            <div className="profileImagesContainerMain">
                {
                    urlOfImages?.map((idOfImage) => (
                        <img src={idOfImage} onClick={() => openPopupWindownImg(idOfImage)} alt="allPicture" style={{ width: "70px", height: "70px", objectFit: "cover" }} />
                    ))
                }

                <AnimatePresence
                    initial={false}
                    exitBeforeEnter={true}
                    onExitComplete={() => null}
                >
                    {openPopupWidnown &&
                        <PopupWindown classNameMain="Share" classNameContainer="shareContainer" setVisible={setOpenPopupWidnown} >
                            <img className='popupImg' src={urlOfChoseImg} alt="" />
                        </PopupWindown>}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ImagesOfUser

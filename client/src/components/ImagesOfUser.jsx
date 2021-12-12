import axios from 'axios';
import React, { useEffect, useState } from 'react'
import changePath from '../changePath';

const ImagesOfUser = ({ user }) => {
    const [urlOfImages, setUrlOfImages] = useState([]);

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

    return (
        <div className="profileImages">
            <div className="profileImagesContainer">
            {
                urlOfImages?.map((idOfImage) => (
                    <img src={idOfImage} alt="allPicture" style={{width: "70px", height: "70px", objectFit: "cover"}}/>
                ))
            }
            </div>
        </div>
    )
}

export default ImagesOfUser

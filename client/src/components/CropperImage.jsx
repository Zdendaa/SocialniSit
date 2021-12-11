import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { GlobalContext } from '../context/GlobalState';
// diky forwardRef budeme moct volat funkce v teto komponentě v nadřezených komponentách
const CropperImage = forwardRef(({ getNewCroppedPicture, aspect, rect }, ref) => { // forwardRef je metoda, která umožňuje nadřazeným komponentům předávat odkazy jejich potomkům
    const { backgroundColor1 } = useContext(GlobalContext);

    const [crop, setCrop] = useState({ aspect });

    const [urlImage, setUrlImage] = useState(null);

    const [image, setImage] = useState(null);

    useImperativeHandle(ref, () => ({ // vse v teto metode se vrati jako ref (odkaz na toto)
        getCroppedImg() {
            if (!urlImage) return;
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
            /*
            const base64Image = canvas.toDataURL("image/jpeg");
            setResult(base64Image);
            getNewCroppedPicture(base64Image);
            */

            canvas.toBlob(async (blob) => {
                blob.name = "sadf";
                setUrlImage(null);
                getNewCroppedPicture(blob);
            });


        }
    }));

    return (
        <>
            <div className="middleAddNewPost">
                <label htmlFor="fileUpload" id="inputfileRegister" className="inputImgAddPost" style={{ backgroundColor: backgroundColor1, color: "white" }} >
                    <span>nahrát fotku</span>
                </label>
                {urlImage && "ahoj"}
                <input id="fileUpload" type="file" accept="image/*" onChange={(e) => { setUrlImage(URL.createObjectURL(e.target.files[0])); console.log(URL.createObjectURL(e.target.files[0])) }} required />
                {
                urlImage && (
                    <>
                        {
                            rect ? (
                                <ReactCrop src={urlImage}
                                    onImageLoaded={setImage}
                                    crop={crop}
                                    onChange={newCrop => setCrop(newCrop)}
                                    style={{ width: "120px", height: "auto" }}
                                />
                            ) :
                            (
                                <ReactCrop src={urlImage}
                                    onImageLoaded={setImage}
                                    crop={crop}
                                    onChange={newCrop => setCrop(newCrop)}
                                    style={{ width: "120px", height: "auto" }}
                                    circularCrop
                                />
                            )
                        }
                        
                    </>
                )

            }
             </div>
            
        </>
    )
});



export default CropperImage

import axios from 'axios';
import React, { useContext } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import CropperImage from './global/CropperImage'
import PopupWindown from './global/PopupWindown'

const AddStory = ({ setIsOpenAddStory }) => {

  const { user } = useContext(GlobalContext);

    const getNewCroppedPicture = async (image, setNoError, setIsLoading, friends, sendNotification) => {
        setIsLoading(true);
        const newImgName = "stories/" + user.username + "/" + image.name + "" + Math.floor( Date.now() / 1000 );
        // obrazek se ulozi do storage
        await uploadImg(image, newImgName).then(async() => {
            console.log('upload img succesfully');
            // stahnuti url obrazku
            const urlOfImg = await downloadUrlImg(newImgName);

            await addNewPhoto(urlOfImg, friends, sendNotification);

            setIsLoading(false);
            setNoError(true);
        }) 
    }

    // funkce pro vytvoeni ulozeni prispevku do databaze
    const addNewPhoto = async (img, friends, sendNotification) => {
        try {
            // vytvoreni promenne ve ktere budou data prispevku
            const newStory = { 
                idOfUser: user._id, 
                urlOfImg: img,
            }
            // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
            const dataOfNewPost = await axios.post(changePath("/stories/addStory"), newStory);
            
            // vsem nasim pratelum posleme notifikaci
            new Promise( () => {
                friends.forEach(async(friend, index) => {
                  await sendNotification(friend._id, 7, null, dataOfNewPost.data._id, "přidal/a nový příběh");
                  if(index === friends.length - 1) { window.location.reload(); }
                })  
              }
            );
            
            
        } catch (err) {
            console.log(err);
        }
    }


  return (
    <PopupWindown classNameMain="AddStory" classNameContainer="shareContainer" setVisible={setIsOpenAddStory}>
      <div className="settingsChangeCoverPicture">
                <CropperImage aspect={6/10} rect={true} addStory={true} saveImg={getNewCroppedPicture}/>
      </div>
    </PopupWindown>
  )
}

export default AddStory
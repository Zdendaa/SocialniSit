import axios from 'axios';
import EmojiPicker from './addMessageVariants/EmojiPicker';
import React, { useContext, useState } from 'react'
import changePath from '../changePath';
import { GlobalContext } from '../context/GlobalState';
import { downloadUrlImg, uploadImg } from '../storageImgActions/imgFunctions';
import CropperImage from './global/CropperImage'
import PopupWindown from './global/PopupWindown'

const AddStory = ({ setIsOpenAddStory }) => {

  const { user, backgroundColor1, backgroundColor2 } = useContext(GlobalContext);

  const [cropImg, setCropImg] = useState(null);

  // promenne pro praci s textem na obrazku
  const [valueOfInput, setValueOfInput] = useState("");
  const [valueOfPlace, setValueOfPlace] = useState("mid");


  const getNewCroppedPicture = async (image, setNoError, setIsLoading, friends, sendNotification) => {
    setIsLoading(true);
    const newImgName = "stories/" + user.username + "/" + image.name + "" + Math.floor(Date.now() / 1000);
    // obrazek se ulozi do storage
    await uploadImg(image, newImgName).then(async () => {
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
        text: valueOfInput,
        position: valueOfPlace,
      }
      // kdyz vse probehne v poradku tak se vytvori samotny prispevek v databazi prispevku
      const dataOfNewStory = await axios.post(changePath("/stories/addStory"), newStory);

      // vsem nasim pratelum posleme notifikaci
      new Promise(() => {
        friends.forEach(async (friend, index) => {
          await sendNotification(friend._id, 7, null, dataOfNewStory.data._id, "přidal/a nový příběh");
          if (index === friends.length - 1) { window.location.reload(); }
        })
      }
      );


    } catch (err) {
      console.log(err);
    }
  }

  return (
    <PopupWindown classNameMain="AddStory" classNameContainer="shareContainer" setVisible={setIsOpenAddStory}>
      <div className="mainContainerSettingsStory">
        <div className="settingsStory">
          <div className='inputEmojiPickerContainer'>
            <input type="text" className="inputInfo" style={{ backgroundColor: backgroundColor2, color: backgroundColor1 }} placeholder="něco k příběhu..." value={valueOfInput} onChange={(e) => { setValueOfInput(e.target.value) }} />
            <EmojiPicker setValOfText={setValueOfInput} />
          </div>
          <select onChange={(e) => { setValueOfPlace(e.target.value) }} className="inputInfo" style={{ backgroundColor: backgroundColor2, color: backgroundColor1 }} >
            <option value="top" >nahoře</option>
            <option value="mid" selected >upřostřed</option>
            <option value="bot" >dole</option>
          </select>
          {cropImg &&
            <div style={{ position: "relative" }}>
              <img alt="" style={{ width: "120px", height: "200px" }} src={cropImg} />
              <span className={valueOfPlace}><span style={{ padding: "5px" }}>{valueOfInput}</span></span>
            </div>
          }
        </div>
        <div className="displayStory">
          <h4 style={{ color: backgroundColor1 }}>Vyber část na obrázku</h4>
          <CropperImage aspect={6 / 10} rect={true} addStory={true} saveImg={getNewCroppedPicture} valueOfPlace={valueOfPlace} setCropImg={setCropImg}>

          </CropperImage>
        </div>
      </div>
    </PopupWindown>
  )
}

export default AddStory
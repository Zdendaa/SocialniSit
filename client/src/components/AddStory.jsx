import React from 'react'
import CropperImage from './CropperImage'
import PopupWindown from './global/PopupWindown'

const AddStory = ({ setIsOpenAddStory }) => {
  return (
    <PopupWindown classNameMain="AddStory" classNameContainer="shareContainer" setVisible={setIsOpenAddStory}>
      <div className="settingsChangeCoverPicture">
                <CropperImage aspect={15/2} rect={true} />
      </div>
    </PopupWindown>
  )
}

export default AddStory
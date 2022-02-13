import React from 'react'
import PopupWindown from './global/PopupWindown'

const AddStory = ({ setIsOpenAddStory }) => {
  return (
    <PopupWindown classNameMain="AddStory" classNameContainer="shareContainer" setVisible={setIsOpenAddStory}>aoj</PopupWindown>
  )
}

export default AddStory
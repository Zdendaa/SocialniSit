import React, { useContext, useState } from 'react'
import Picker from 'emoji-picker-react';
import { GlobalContext } from '../../context/GlobalState';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
const EmojiPicker = ({ setValOfText }) => {
    const { backgroundColor1, backgroundColor4 } = useContext(GlobalContext);

    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setValOfText(val => val + emojiObject.emoji);
    };

    return (
        <>
            <button className='buttonsForVariantsMessage opacity' onClick={() => setIsOpen(!isOpen)} style={{ color: backgroundColor4, backgroundColor: backgroundColor1 }} ><HiOutlineEmojiHappy className='reactIcon' /></button>
            {
                isOpen &&
                <div className='pickerReact'>
                    <Picker onEmojiClick={onEmojiClick} />
                </div>
            }
        </>
    )
}

export default EmojiPicker
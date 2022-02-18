import React from 'react'
import { TiDelete } from 'react-icons/ti'
import { motion } from 'framer-motion';

const PopupWindown = ({ classNameMain, classNameContainer, children, setVisible }) => {
  return (
    <>
        <motion.div
            className={classNameMain} 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={classNameContainer}>
                {children}
                <TiDelete className="scaled removeImgShow" onClick={() => setVisible(false)} />
            </div>
        </motion.div>
        <div className="wallPaperNotWorking"></div>
    </>
  )
}

export default PopupWindown
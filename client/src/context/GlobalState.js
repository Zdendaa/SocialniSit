import React, { createContext, useReducer } from 'react'
import Reducer from "./Reducer"

// initial state zde bude ulozeny uzivatel aby jsem mohl jeho data pouzivat ve vsech komponentach
const initialState = {
    user: localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")), // do user se ulozi json promenna user z local storagu
    backgroundColor1: "#D88100", // hlavni barva
    backgroundColor2: "#F4F4F4", // sekundarni barva
    backgroundColor3: "black", // barva cerny text
    backgroundColor4: "white", // barva pro bily text
}

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    // akce ktere muzu volat

    // registrovani uzivatele
    function setUser(data) {
        dispatch({
            type: 'SET_USER',
            payload: data
        })
    }

    // odhlaseni uzivatele
    function deleteUser() {
        dispatch({
            type: 'DELETE_USER',
        })
    }

    // zmena profilove fotky
    function changeProfileImg(data) {
        dispatch({
            type: 'CHANGE_PROFILE_IMG',
            payload: data
        })
    }

    // zmena profilove fotky
    function changeCoverImg(data) {
        dispatch({
            type: 'CHANGE_COVER_IMG',
            payload: data
        })
    }


    return (
        <GlobalContext.Provider value={{
            user: state.user,
            backgroundColor1: state.backgroundColor1, 
            backgroundColor2: state.backgroundColor2, 
            backgroundColor3: state.backgroundColor3, 
            backgroundColor4: state.backgroundColor4,
            setUser, 
            deleteUser,
            changeProfileImg,
            changeCoverImg
        }}>
            {children}
        </GlobalContext.Provider>
    )
}
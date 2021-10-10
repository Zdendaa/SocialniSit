import React, { createContext, useReducer } from 'react'
import Reducer from "./Reducer"

// initial state zde bude ulozeny uzivatel aby jsem mohl jeho data pouzivat ve vsech komponentach
const initialState = {
    user: JSON.parse(localStorage.getItem("user")), // do user se ulozi json promenna user z local storagu
    backgroundColor1: "#D88100",
    backgroundColor2: "#F4F4F4",
    backgroundColor3: "#D88100",
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

    function deleteUser() {
        dispatch({
            type: 'DELETE_USER',
        })
    }


    return (
        <GlobalContext.Provider value={{
            user: state.user,
            backgroundColor1: state.backgroundColor1, 
            backgroundColor2: state.backgroundColor2, 
            backgroundColor3: state.backgroundColor3, 
            setUser, 
            deleteUser
        }}>
            {children}
        </GlobalContext.Provider>
    )
}
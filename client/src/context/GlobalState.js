import React, { createContext, useReducer } from 'react'
import Reducer from "./Reducer"

// initial state zde bude ulozeny uzivatel aby jsem mohl jeho data pouzivat ve vsech komponentach
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) // do user se ulozi json promenna user z local storagu
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
        <GlobalContext.Provider value={{user: state.user, setUser, deleteUser}}>
            {children}
        </GlobalContext.Provider>
    )
}
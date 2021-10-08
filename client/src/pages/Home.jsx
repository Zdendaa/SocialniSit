import React from 'react'

const Home = () => {
    return (
        <div>
            home
            <button onClick={ () => { 
                localStorage.removeItem("user")
                console.log(localStorage.getItem("user"));
             } }>log out</button>
        </div>
    )
}

export default Home

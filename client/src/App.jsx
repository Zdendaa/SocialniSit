import './App.css';
import Register from './pages/Register'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import { GlobalContext } from './context/GlobalState';
import { useContext, useEffect, useRef, useState } from 'react';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import { io } from 'socket.io-client';

function App() {
  const {user} = useContext(GlobalContext);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const socket = useRef();

  useEffect(() => {
      // pripojeni socket.io
      if(user) {
         socket.current = io("ws://localhost:8900");
      }
  }, [user])
  
  useEffect(() => {
      if(user) {
        // zavolani socket.io addUser a poslani hodnoty user.id
        socket.current.emit("addUser", user._id);
        // dostani vsech online uzivatelu
        socket.current.on("getUsers", users => {
            setOnlineUsers(users.filter(onlineUser => onlineUser.userId !== user._id));
        })
      }
  }, [user])


  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            { user ? <Home onlineUsers={ onlineUsers } socket={socket.current}/> : <Redirect to="/register" /> }
          </Route>
          <Route path="/register">
            { !user ? <Register /> : <Redirect to="/" /> }
          </Route>
          <Route path="/login">
            { !user ? <Login /> : <Redirect to="/" /> }
          </Route>
          <Route path="/profile/:idOfUser">
            { user ? <Profile socket={socket.current} /> : <Redirect to="/register" /> }
          </Route>
          <Route path="/settings">
            { user ? <ProfileSettings /> : <Redirect to="/register" /> }
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

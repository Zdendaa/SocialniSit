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
import { useContext, useEffect } from 'react';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import { io } from 'socket.io-client';
import Messenger from './pages/Messenger';

function App() {
  const { user, setOnlineFriends, setSocket, socket } = useContext(GlobalContext);

  useEffect(() => {
    // pripojeni socket.io
    if (user) {
      setSocket(io("ws://localhost:8900"));
    }
  }, [user])

  useEffect(() => {
    if (user) {
      // zavolani socket.io addUser a poslani hodnoty user.id

      socket?.emit("addUser", user._id);
      // dostani vsech online uzivatelu
      socket?.on("getUsers", users => {
        console.log(users);
        setOnlineFriends(users.filter(onlineUser => onlineUser.userId !== user._id));
      })
    }
  }, [user, socket]);


  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {user ? <Home /> : <Redirect to="/register" />}
          </Route>
          <Route path="/register">
            {!user ? <Register /> : <Redirect to="/" />}
          </Route>
          <Route path="/login">
            {!user ? <Login /> : <Redirect to="/" />}
          </Route>
          <Route path="/profile/:idOfUser">
            {user ? <Profile /> : <Redirect to="/register" />}
          </Route>
          <Route path="/settings">
            {user ? <ProfileSettings /> : <Redirect to="/register" />}
          </Route>
          <Route path="/messenger/:idOfUser/:idOfChat" >
            {user ? <Messenger /> : <Redirect to="/register" />}
          </Route>
          <Route path="*" >
            {user ? <Home /> : <Redirect to="/register" />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

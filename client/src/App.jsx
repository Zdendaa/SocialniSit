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
import { useContext } from 'react';
import Profile from './pages/Profile';

function App() {
  const {user} = useContext(GlobalContext);
  
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            { user ? <Home /> : <Redirect to="/register" /> }
          </Route>
          <Route path="/register">
            { !user ? <Register /> : <Redirect to="/" /> }
          </Route>
          <Route path="/login">
            { !user ? <Login /> : <Redirect to="/" /> }
          </Route>
          <Route path="/profile/:idOfUser">
            { user ? <Profile /> : <Redirect to="/register" /> }
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

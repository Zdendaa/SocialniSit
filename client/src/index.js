import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlobalProvider } from './context/GlobalState';

const startApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

if (window.cordova) {
  document.addEventListener("deviceready", startApp, false);
} else {
  startApp();
}



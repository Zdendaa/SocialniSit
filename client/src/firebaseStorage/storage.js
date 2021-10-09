import firebase from 'firebase/app'

import "firebase/storage"

// pripojeni k firebase 
const firebaseConfig = {
    apiKey: "AIzaSyAAoZQnJBdS-cewGfaahvtFo4yCht1UI2I",
    authDomain: "socialapp-74542.firebaseapp.com",
    projectId: "socialapp-74542",
    storageBucket: "socialapp-74542.appspot.com",
    messagingSenderId: "893529540261",
    appId: "1:893529540261:web:ebc3daabc0e1462ecfef4c",
    measurementId: "G-311G3G7JMT"
  };

firebase.initializeApp(firebaseConfig);
// vytvoreni uloziste s kterym muzeme pracovat
var storage = firebase.storage();

export default storage;
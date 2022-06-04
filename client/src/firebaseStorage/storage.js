import firebase from 'firebase/app'

import "firebase/storage"
import "firebase/auth";

// pripojeni k firebase 
const firebaseConfig = {
  apiKey: "AIzaSyDTtUnhCGoG6grg8kWAGf3eRqDLM8WqAYc",
  authDomain: "socialapp-37b2c.firebaseapp.com",
  projectId: "socialapp-37b2c",
  storageBucket: "socialapp-37b2c.appspot.com",
  messagingSenderId: "1050215924923",
  appId: "1:1050215924923:web:bb25243c81dff11f59959e",
  measurementId: "G-JDL1ECNSK7"
};

firebase.initializeApp(firebaseConfig);
// vytvoreni uloziste s kterym muzeme pracovat
var storage = firebase.storage();

export { firebase, storage };

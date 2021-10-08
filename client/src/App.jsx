import { useState } from 'react';
import './App.css';

import storage from './firebaseStorage/storage';
import {uploadImg} from './storageImgDownload/imgDownload';

function App() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);

  const pokus = async () => {
    await uploadImg(image, storage); 
  }
  
  return (
    <div className="App">

      <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
      <button onClick={pokus }>odeslat</button>
    <img src={url && url} alt="" />
    <button >aaa</button>
      {//<Register />
      }
    </div>
  );
}

export default App;

import {storage} from "../firebaseStorage/storage";
import validator from 'validator';

// ulozeni img do uloziste
export const uploadImg = async (image, name) => {
    if(image) {
      // odeslani img do storage
      try {
        await storage.ref(name).put(image).then(() => {
           console.log("soubor ulozen v ulozisti");
        });
      } catch (err) {
        console.log(err);
      }
      
    }
}

// stahnuti url obrazku pomoci jeho jmena
export const downloadUrlImg = async (name) => {
  const url = await storage.ref(name).getDownloadURL();
  return url;
}

// stahnuti url obrazku pomoci jeho jmena, kdyz obrazek neexistuje vrati null kdyz ano vrati url obrazku
export const getUrlImgOrNull = async (user) => {
  const url = user.idOrUrlOfProfilePicture ? ( validator.isURL(user.idOrUrlOfProfilePicture) ? user.idOrUrlOfProfilePicture : await downloadUrlImg("users/" + user.username + "/" + user.idOrUrlOfProfilePicture)) : null;
  return url;
}

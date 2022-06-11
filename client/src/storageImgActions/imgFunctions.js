import { storage } from "../firebaseStorage/storage";

// ulozeni img do uloziste
export const uploadImg = async (image, name) => {
  if (image) {
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
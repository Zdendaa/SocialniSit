import storage from "../firebaseStorage/storage";

// ulozeni img do uloziste
export const uploadImg = async (image, name) => {
    if(image) {
      // odeslani img do storage
      storage.ref(name).put(image).then(() => {
        console.log("soubor odeslan a ulozen v ulozisti");
      });
    }
}

// stahnuti url obrazku pomoci jeho jmena
export const downloadUrlImg = async (name) => {
  const url = await storage.ref(name).getDownloadURL();
  return url;
}
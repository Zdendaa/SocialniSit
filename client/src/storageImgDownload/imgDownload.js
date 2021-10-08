export const uploadImg = async (image, storage) => {
    if(image) {
      // odeslani img do storage
      storage.ref(image.name).put(image).then(() => {
        console.log("soubor odeslan a ulozen v ulozisti");
      });
      //images.put(image);
    }
}

export const downloadUrlImg = async (name, storage) => {
  const url = await storage.ref(name).getDownloadURL();
  return url;
}
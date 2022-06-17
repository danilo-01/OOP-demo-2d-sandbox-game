export const createImage = (url) => {
  const image = new Image(url);
  image.src = url;
  return image;
};

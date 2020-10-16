export const dataURLToImage = function (dataURL) {
  const contentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'png';
  const sliceSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 512;

  const byteArrays = [];

  for (let offset = 0; offset < dataURL.length; offset += sliceSize) {
    const slice = dataURL.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {
    type: contentType,
  });
  return blob;
};

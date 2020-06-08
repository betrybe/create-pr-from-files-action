const getFilenamesFromEncodedArray = (encodedArray) => {
  const decoded = Buffer.from(encodedArray, 'base64').toString();
  if (!decoded) return [];
  return decoded.split(',');
};

module.exports = getFilenamesFromEncodedArray;

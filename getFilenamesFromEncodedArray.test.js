const getFilenamesFromEncodedArray = require('./getFilenamesFromEncodedArray');

describe('getFilenamesFromEncodedArray', () => {
  it('get filenames', () => {
    const encoded = 'Y29udGVudC9pbnRyby9qYXZhc2NyaXB0L2pzLXBhcnQtOC1zb2x1dGlvbnMubWQsY29udGVudC9pbnRyby9qYXZhc2NyaXB0L2pzLXBhcnQtOC5tZA==';
    const array = [
      'content/intro/javascript/js-part-8-solutions.md',
      'content/intro/javascript/js-part-8.md'
    ];
    expect(getFilenamesFromEncodedArray(encoded).sort()).toEqual(array.sort());
  });

  it('get empty list of filenames', () => {
    const encoded = '';
    const array = [];
    expect(getFilenamesFromEncodedArray(encoded).sort()).toEqual(array.sort());
  });
});

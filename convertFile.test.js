const convertFile = require('./convertFile');

describe('convertFile', () => {
  it('convert markdown files', () => {
    const prefix = 'priv/markdown_templates';
    const markdownFile = 'content/elixir/js-part-3.md';
    const expected = ['priv/markdown_templates/content/elixir/js-part-3.html.md', 'priv/markdown_templates/content/elixir/js-part-3.yaml'];
    expect(convertFile(prefix, markdownFile).sort()).toEqual(expected.sort());
  });

  it('convert images', () => {
    const imageFile = 'content/images/rectangles.png';
    const expected = ['assets/static/images/rectangles.png'];
    expect(convertFile('', imageFile).sort()).toEqual(expected.sort());
  });
});

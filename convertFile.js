const path = require('path');

const convertFile = (prefix, filename) => {
  const parsed = path.parse(filename);
  if (parsed.ext === '.md') return convertMarkdownFile(prefix, parsed);
  if (['.png', '.jpeg'].some(i => i === parsed.ext)) return convertImage(filename);
};

const convertMarkdownFile = (prefix, { dir, _base, ext, name }) => ([
  path.join(prefix, dir, `${name}.html${ext}`),
  path.join(prefix, dir, `${name}.yaml`),
]);

const convertImage = (filename) => ([
  filename.replace('content/', 'assets/static/')
]);

module.exports = convertFile;

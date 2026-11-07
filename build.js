const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('index.html')
  .replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, file) => '<style>\n' + read(file) + '</style>')
  .replace(/<script src="([^"]+)"><\/script>/g, (_, file) => '<script>\n' + read(file) + '</script>');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'logica.html'), html);
console.log('dist/logica.html', html.length, 'bytes');

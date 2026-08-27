const fs = require('fs');
const path = require('path');

const srcFile = process.argv[2];
const dstFile = process.argv[3];

if (!srcFile || !dstFile) {
  console.error('Usage: node write-from-file.js <srcFile> <dstFile>');
  process.exit(1);
}

const content = fs.readFileSync(srcFile, 'utf-8');
const p = path.resolve(__dirname, dstFile);
fs.mkdirSync(path.dirname(p), { recursive: true });
fs.writeFileSync(p, content, 'utf-8');
console.log('Successfully wrote:', dstFile);

const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2];
const base64Content = process.argv[3];

if (!targetFile || !base64Content) {
  console.error('Usage: node writer.js <target_file> <base64_content>');
  process.exit(1);
}

const dir = path.dirname(targetFile);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const decodedContent = Buffer.from(base64Content, 'base64').toString('utf-8');
fs.writeFileSync(targetFile, decodedContent, 'utf-8');
console.log('Successfully wrote to ' + targetFile);

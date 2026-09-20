const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

// fix backticks
html = html.replace(/\\`/g, '`');
html = html.replace(/\\\$/g, '$');

fs.writeFileSync('ocr.html', html);
console.log('Fixed backticks');

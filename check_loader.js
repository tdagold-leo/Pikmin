const fs = require('fs');
const html = fs.readFileSync('ocr.html', 'utf8');
if (!html.includes('id="loader"')) console.log('LOADER MISSING');
else console.log('LOADER EXISTS');

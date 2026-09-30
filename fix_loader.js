const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

// Add loader back right above the status element
html = html.replace('<div id="status"></div>', '<div class="loader" id="loader" style="margin: 10px auto;"></div>\n    <div id="status"></div>');

fs.writeFileSync('ocr.html', html);
console.log('Fixed loader missing');

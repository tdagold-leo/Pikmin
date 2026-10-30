const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.08.2106"');
html = html.replace(/ocr\.html\?v=\d+/, 'ocr.html?v=202610082106');
fs.writeFileSync('index.html', html);

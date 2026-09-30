const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// replace ocr.html?v=... with ocr.html?v=202609202123
html = html.replace(/href="ocr\.html[^"]*"/, 'href="ocr.html?v=202609202123"');

// bump version
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.09.20.2123"');
html = html.replace(/v=\d{10,14}/g, 'v=202609202123');

fs.writeFileSync('index.html', html);

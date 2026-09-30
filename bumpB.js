const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.09.21.0402"');
html = html.replace(/v=\d{10,14}/g, 'v=202609210402');
fs.writeFileSync('index.html', html);

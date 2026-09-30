const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.09.20.2039"');
html = html.replace(/v=\d{10,14}/g, 'v=202609202039');
fs.writeFileSync('index.html', html);

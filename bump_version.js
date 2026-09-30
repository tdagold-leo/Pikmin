const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.09.23.2138"');
html = html.replace(/v=\d{10,14}/g, 'v=202609232138');
fs.writeFileSync('index.html', html);

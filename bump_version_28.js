const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('⬇️ 下載格式', '⬇️ 下載檔案');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.10.0040"');
html = html.replace(/v=\d{10,14}/g, 'v=202610100040');
fs.writeFileSync('index.html', html);

let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/v=\d{10,14}/g, 'v=202610100040');
fs.writeFileSync('js/main.js', js);
console.log('Text and version updated');

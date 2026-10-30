const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const sOption = `<option value="csv">CSV</option>`;
const rOption = `<option value="csv">CSV</option>\n                                <option value="txt">TXT</option>`;
if (html.includes(sOption)) {
    html = html.replace(sOption, rOption);
}
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2250"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092250');
fs.writeFileSync('index.html', html);
console.log('index.html patched');

// 2. Update js/main.js
let js = fs.readFileSync('js/main.js', 'utf8');
const sFormatLogic = `        } else if (format === 'csv') {
            data = 'lat,lng,name\\n';
            for (const pt of coords) {
                data += \`\${pt.lat},\${pt.lng},\${pt.name || ''}\\n\`;
            }
            mime = 'text/csv';
        }`;
const rFormatLogic = `        } else if (format === 'csv') {
            data = 'lat,lng,name\\n';
            for (const pt of coords) {
                data += \`\${pt.lat},\${pt.lng},\${pt.name || ''}\\n\`;
            }
            mime = 'text/csv';
        } else if (format === 'txt') {
            data = '';
            for (const pt of coords) {
                data += \`\${pt.lat}, \${pt.lng}\\n\`;
            }
            mime = 'text/plain';
        }`;
if (js.includes(sFormatLogic)) {
    js = js.replace(sFormatLogic, rFormatLogic);
}
fs.writeFileSync('js/main.js', js);
console.log('js/main.js patched');

const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('accept=".gpx,.kml,.json"', 'accept=".gpx,.kml,.json,.txt,.csv"');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2235"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092235');
fs.writeFileSync('index.html', html);
console.log('index.html patched');

// 2. Update js/main.js
let js = fs.readFileSync('js/main.js', 'utf8');

const sRouteUpload = `            if (coords.length === 0) {
                return alert('無法在檔案中找到路徑點 (支援 GPX/KML/JSON 格式)');
            }`;
            
const rRouteUpload = `            // Fallback: txt / csv line-by-line parsing
            if (coords.length === 0) {
                const lines = text.split('\\n');
                const coordRegex = /(-?\\d{1,3}\\.\\d+)[,\\s\\t]+(-?\\d{1,3}\\.\\d+)/;
                lines.forEach(line => {
                    const match = line.match(coordRegex);
                    if (match) {
                        let lat = parseFloat(match[1]);
                        let lng = parseFloat(match[2]);
                        
                        // Auto-swap if it looks like lon,lat (lat must be between -90 and 90)
                        if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
                            let temp = lat; lat = lng; lng = temp;
                        }
                        
                        if (!isNaN(lat) && !isNaN(lng)) {
                            coords.push({ lat, lng, name: '節點' });
                        }
                    }
                });
            }

            if (coords.length === 0) {
                return alert('無法在檔案中找到路徑點 (支援 GPX/KML/JSON/TXT/CSV 格式)');
            }`;

if (js.includes(sRouteUpload)) {
    js = js.replace(sRouteUpload, rRouteUpload);
    fs.writeFileSync('js/main.js', js);
    console.log('js/main.js patched');
} else {
    console.log('sRouteUpload not found');
}

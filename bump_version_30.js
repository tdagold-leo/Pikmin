const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Centralize the UI logic in updateRouteStatus
// In toggleRouteDrawMode, we just toggle the boolean and call updateRouteStatus
const toggleOld = `    window.toggleRouteDrawMode = function() {
        window.isRouteDrawMode = !window.isRouteDrawMode;
        const btn = document.getElementById('route-draw-btn');
        if (window.isRouteDrawMode) {
            btn.style.background = '#ecfdf5';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#047857';
            btn.innerHTML = '🖍️點選地圖標記點位...';
            updateRouteStatus();
        } else {
            btn.style.background = '#f8fafc';
            btn.style.borderColor = '#94a3b8';
            btn.style.color = '#334155';
            btn.innerHTML = '🖍️ 開始在地圖上點擊連線';
        }
    };`;

const toggleNew = `    window.toggleRouteDrawMode = function() {
        window.isRouteDrawMode = !window.isRouteDrawMode;
        updateRouteStatus();
    };`;

if (js.includes(toggleOld)) {
    js = js.replace(toggleOld, toggleNew);
}

// 2. Change the text in updateRouteStatus to what the user explicitly requested
const textOld = `drawBtn.innerHTML = '🖍️ 編輯<br><span style="font-size:10px;font-weight:normal;color:#64748b;">(點擊地圖連線)</span>';`;
const textNew = `drawBtn.innerHTML = '🖍️ 開始在地圖上<br><span style="font-size:10px;font-weight:normal;color:#64748b;">點擊連線</span>';`;

if (js.includes(textOld)) {
    js = js.replace(textOld, textNew);
}

// Update version
js = js.replace(/v=\d{10,14}/g, 'v=202610100050');
fs.writeFileSync('js/main.js', js);
console.log('JS patched');

// Update HTML default state
let html = fs.readFileSync('index.html', 'utf8');
const htmlOld = `🖍️ 編輯<br><span style="font-size:10px;font-weight:normal;color:#64748b;">(點擊地圖連線)</span>`;
const htmlNew = `🖍️ 開始在地圖上<br><span style="font-size:10px;font-weight:normal;color:#64748b;">點擊連線</span>`;
if (html.includes(htmlOld)) {
    html = html.replace(htmlOld, htmlNew);
}

html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.10.0050"');
html = html.replace(/v=\d{10,14}/g, 'v=202610100050');
fs.writeFileSync('index.html', html);
console.log('HTML patched');

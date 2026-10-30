const fs = require('fs');

// Update JS
let js = fs.readFileSync('js/main.js', 'utf8');

const jsOld1 = `            if (window.isRouteDrawMode) {
                drawBtn.innerText = '🖍️ 結束編輯 (停止連線)';
                drawBtn.style.background = '#e0f2fe';
            } else {
                drawBtn.innerText = '🖍️ 編輯 (點擊地圖連線)';
                drawBtn.style.background = '#f8fafc';
            }`;

const jsNew1 = `            if (window.isRouteDrawMode) {
                drawBtn.innerHTML = '🖍️ 結束編輯<br><span style="font-size:10px;font-weight:normal;color:#64748b;">(停止連線)</span>';
                drawBtn.style.background = '#e0f2fe';
            } else {
                drawBtn.innerHTML = '🖍️ 編輯<br><span style="font-size:10px;font-weight:normal;color:#64748b;">(點擊地圖連線)</span>';
                drawBtn.style.background = '#f8fafc';
            }`;

if (js.includes(jsOld1)) {
    js = js.replace(jsOld1, jsNew1);
} else {
    console.log("Could not find jsOld1");
}

// Remove the redundant innerText updates in other places (they get immediately overridden anyway, but let's be clean)
const jsOld2 = `        if (drawBtn) {
            drawBtn.innerText = '🖍️ 結束編輯 (停止連線)';
            drawBtn.style.background = '#e0f2fe';
        }`;
if (js.includes(jsOld2)) {
    js = js.replace(jsOld2, `        if (drawBtn) {
            drawBtn.style.background = '#e0f2fe';
        }`);
}

js = js.replace(/v=\d{10,14}/g, 'v=202610100045');
fs.writeFileSync('js/main.js', js);
console.log('JS patched');

// Update HTML
let html = fs.readFileSync('index.html', 'utf8');
const htmlOld = `🖍️ 編輯 (點擊地圖連線)</button>`;
const htmlNew = `🖍️ 編輯<br><span style="font-size:10px;font-weight:normal;color:#64748b;">(點擊地圖連線)</span></button>`;
if (html.includes(htmlOld)) {
    html = html.replace(htmlOld, htmlNew);
} else {
    console.log("Could not find htmlOld");
}

// Add line-height to make it look tighter
const htmlStyleOld = `color:#334155;">🖍️ 編輯<br>`;
const htmlStyleNew = `color:#334155; line-height:1.2;">🖍️ 編輯<br>`;
if (html.includes(htmlStyleOld)) {
    html = html.replace(htmlStyleOld, htmlStyleNew);
}

html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.10.0045"');
html = html.replace(/v=\d{10,14}/g, 'v=202610100045');
fs.writeFileSync('index.html', html);
console.log('HTML patched');

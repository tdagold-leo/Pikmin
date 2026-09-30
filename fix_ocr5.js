const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

const oldDropZoneRegex = /<div id="drop-zone">[\s\S]*?<\/div>/;

const newUploadUI = `    <div class="mush-ocr-row" style="flex-direction:column; gap:6px; width:100%; margin-bottom:16px;">
        <input type="file" id="file-input" accept="image/*" multiple style="display:none;" onchange="handleFileInputChange(event)">
        <button type="button" onclick="document.getElementById('file-input').click()"
            style="width:100%; padding:24px 12px; border-radius:12px; background:linear-gradient(135deg,#10b981,#059669); color:white; border:none; font-size:16px; font-weight:bold; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 14px rgba(16,185,129,0.35); letter-spacing:0.5px;">
            <div style="font-size: 28px;">📸</div>
            <div>點擊選擇圖片</div>
            <div style="font-size: 12px; color: #d1fae5; font-weight:normal; margin-top:4px;">(支援連續上傳多張圖，座標會自動換行加上去)</div>
        </button>
    </div>`;

html = html.replace(oldDropZoneRegex, newUploadUI);

// Clean up CSS
html = html.replace(/#drop-zone {[\s\S]*?z-index: 10;\s*}/, '');

// Fix JS
const jsRegex = /const dropZone = document.getElementById\('drop-zone'\);[\s\S]*?async function handleFiles/m;
const newJS = `const fileInput = document.getElementById('file-input');
    const resultText = document.getElementById('result-text');
    const statusEl = document.getElementById('status');
    const loader = document.getElementById('loader');

    window.handleFileInputChange = function(event) {
        if (event.target.files && event.target.files.length > 0) {
            handleFiles(event.target.files);
        }
    };

    async function handleFiles`;
html = html.replace(jsRegex, newJS);

// Remove dropText from setLoading
html = html.replace("dropText.style.display = 'none';", "");
html = html.replace("dropText.style.display = 'block';", "");

fs.writeFileSync('ocr.html', html);
console.log('Fixed ocr.html UI');

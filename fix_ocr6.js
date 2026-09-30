const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

const targetHtml = `<div class="mush-ocr-row" style="flex-direction:column; gap:6px; width:100%; margin-bottom:16px;">
        <input type="file" id="file-input" accept="image/*" multiple style="display:none;" onchange="handleFileInputChange(event)">
        <button type="button" onclick="document.getElementById('file-input').click()"
            style="width:100%; padding:24px 12px; border-radius:12px; background:linear-gradient(135deg,#10b981,#059669); color:white; border:none; font-size:16px; font-weight:bold; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 14px rgba(16,185,129,0.35); letter-spacing:0.5px;">
            <div style="font-size: 28px;">📸</div>
            <div>點擊選擇圖片</div>
            <div style="font-size: 12px; color: #d1fae5; font-weight:normal; margin-top:4px;">(支援連續上傳多張圖，座標會自動換行加上去)</div>
        </button>
    </div>`;

const replacementHtml = `<div class="mush-ocr-row" style="display:flex; gap:8px; width:100%; margin-bottom:16px;">
        <input type="file" id="file-input" accept="image/*" multiple style="display:none;" onchange="updateSelectedCount()">
        <button type="button" onclick="document.getElementById('file-input').click()"
            style="flex:1; padding:16px 8px; border-radius:12px; background:#f1f5f9; color:#334155; border:2px dashed #cbd5e1; font-size:14px; font-weight:bold; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; transition:all 0.2s;">
            <div style="font-size: 20px;">1️⃣</div>
            <div>選擇圖片</div>
        </button>
        <button type="button" onclick="startRecognition()"
            style="flex:1; padding:16px 8px; border-radius:12px; background:linear-gradient(135deg,#10b981,#059669); color:white; border:none; font-size:14px; font-weight:bold; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:0 4px 14px rgba(16,185,129,0.35);">
            <div style="font-size: 20px;">2️⃣</div>
            <div>開始辨識</div>
        </button>
    </div>`;

// We also need to fix the JS. Let's find handleFileInputChange
const oldJsRegex = /window\.handleFileInputChange[\s\S]*?async function handleFiles\(files\) {/m;
const newJs = `window.updateSelectedCount = function() {
        const fileInput = document.getElementById('file-input');
        const statusEl = document.getElementById('status');
        if (fileInput.files && fileInput.files.length > 0) {
            statusEl.innerText = \`✅ 已選擇 \${fileInput.files.length} 張圖片，請點擊右方「開始辨識」\`;
        } else {
            statusEl.innerText = \`尚未選擇圖片\`;
        }
    };

    window.startRecognition = function() {
        const fileInput = document.getElementById('file-input');
        if (!fileInput.files || fileInput.files.length === 0) {
            alert("請先選擇圖片！");
            return;
        }
        handleFiles(fileInput.files);
    };

    async function handleFiles(files) {`;

const normalize = s => s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();

let startIdx = normalize(html).indexOf(normalize(targetHtml).substring(0, 100));
if (startIdx !== -1) {
    // using regex might be flaky with spaces, let's use standard replace logic
    // but regex for JS is safer because it's localized
}

// More robust HTML replacement
html = html.replace(/<div class="mush-ocr-row"[\s\S]*?<\/button>\s*<\/div>/, replacementHtml);
html = html.replace(oldJsRegex, newJs);

fs.writeFileSync('ocr.html', html);
console.log('Fixed ocr.html for two-step');

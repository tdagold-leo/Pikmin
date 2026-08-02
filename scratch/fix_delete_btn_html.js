const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

const targetBtnStr = `<button class="btn-sm btn-primary btn-block" style="margin-top:10px; padding:12px; background:var(--primary); color:white; border:none; font-size:14px; font-weight:bold; border-radius:8px;" onclick="addItem()">確定新增</button>`;

const newBtnStr = `<div style="display:flex; gap:10px; margin-top:10px;">
                <button id="add-modal-delete-btn" type="button" class="btn-sm btn-danger btn-block" style="display:none; flex:1; padding:12px; background:#ef4444; color:white; border:none; font-size:14px; font-weight:bold; border-radius:8px;" onclick="">🗑️ 刪除</button>
                <button class="btn-sm btn-primary btn-block" style="flex:2; padding:12px; background:var(--primary); color:white; border:none; font-size:14px; font-weight:bold; border-radius:8px;" onclick="addItem()">確定新增</button>
            </div>`;

if (indexHtml.includes(targetBtnStr)) {
    indexHtml = indexHtml.replace(targetBtnStr, newBtnStr);
    indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
    fs.writeFileSync(indexPath, indexHtml, 'utf-8');
    console.log('Successfully injected add-modal-delete-btn');
} else {
    console.log('Could not find targetBtnStr in index.html');
}

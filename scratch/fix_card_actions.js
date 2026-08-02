const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /<div class="lm-nav-right">[\s\S]*?<\/div>\s*<\/div>/;
const replaceStr = `<div class="card-actions" style="display:flex; gap:4px; margin-top:auto; padding-top:4px;">
                    <button class="btn-sm btn-default" onclick="copyCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}', this)">📍 複製</button>
                    \${item.coords ? \`<button class="btn-sm btn-default" style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0;" onclick="goToMapCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}')">🗺️ 地圖</button>\` : ''}
                    <button class="btn-sm btn-edit" style="flex:1; background:#f59e0b; color:white; border:none;" onclick="editLandmark('\${item.id}')">✏️ 修改</button>
                </div>`;

if (regex.test(mainJs)) {
    mainJs = mainJs.replace(regex, replaceStr);
    console.log('Successfully replaced lm-nav-right with card-actions');
} else {
    console.log('Regex did not match!');
}

mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

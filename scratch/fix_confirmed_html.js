const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

const regex = /(<input type="text" id="lm-note" class="input-base" placeholder=".*?">\s*<\/div>)/;

const confirmedCheckboxHtml = `
                  <div class="input-group" style="flex-direction:row; align-items:center; gap:8px; margin-top:5px;">
                      <input type="checkbox" id="lm-confirmed" style="width:16px; height:16px; cursor:pointer;">
                      <label for="lm-confirmed" style="margin:0; cursor:pointer; font-weight:normal; font-size:14px; color:var(--text-main);">✅ 已確認 (代表此點位資訊正確無誤)</label>
                  </div>`;

if (regex.test(indexHtml) && !indexHtml.includes('id="lm-confirmed"')) {
    indexHtml = indexHtml.replace(regex, `$1` + confirmedCheckboxHtml);
    // Bump version again to be safe
    indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
    fs.writeFileSync(indexPath, indexHtml, 'utf-8');
    console.log('Successfully inserted lm-confirmed!');
} else if (indexHtml.includes('id="lm-confirmed"')) {
    console.log('lm-confirmed is already present.');
} else {
    console.log('Failed to match regex for insertion!');
}

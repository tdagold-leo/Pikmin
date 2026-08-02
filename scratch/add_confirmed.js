const fs = require('fs');
const path = require('path');

// 1. Update index.html
const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Insert checkbox in form-landmark
const noteGroupHtml = `                  <div class="input-group">
                      <label>備註 (選填)</label>
                      <input type="text" id="lm-note" class="input-base" placeholder="例如：大花、名稱等">
                  </div>`;
                  
const confirmedCheckboxHtml = `                  <div class="input-group" style="flex-direction:row; align-items:center; gap:8px; margin-top:5px;">
                      <input type="checkbox" id="lm-confirmed" style="width:16px; height:16px; cursor:pointer;">
                      <label for="lm-confirmed" style="margin:0; cursor:pointer; font-weight:normal; font-size:14px; color:var(--text-main);">✅ 已確認 (代表此點位資訊正確無誤)</label>
                  </div>`;

if (!indexHtml.includes('id="lm-confirmed"')) {
    indexHtml = indexHtml.replace(noteGroupHtml, noteGroupHtml + '\n' + confirmedCheckboxHtml);
}

// Bump main.js version
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());

fs.writeFileSync(indexPath, indexHtml, 'utf-8');
console.log('Updated index.html');


// 2. Update js/main.js
const mainPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainPath, 'utf-8');

// Update makeLmCard to display badge
const typePillHtml = `<span class="lm-type-pill">\${escapeHtml(item.type)}</span>`;
const confirmedBadgeHtml = `\${item.confirmed ? '<span style="background:#dcfce7; color:#166534; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:bold; margin-left:6px;">✅ 已確認</span>' : ''}`;

if (!mainJs.includes('✅ 已確認')) {
    mainJs = mainJs.replace(typePillHtml, typePillHtml + '\n                        ' + confirmedBadgeHtml);
}

// Update editLandmark to load confirmed state
const editCityStr = `document.getElementById('lm-city').value = item.city || '';`;
const editConfirmedStr = `\n          const confirmedEl = document.getElementById('lm-confirmed');\n          if (confirmedEl) confirmedEl.checked = item.confirmed || false;`;

if (!mainJs.includes('lm-confirmed')) {
    mainJs = mainJs.replace(editCityStr, editCityStr + editConfirmedStr);
}

// Update saveLandmark to save confirmed state
const saveCityStr = `const lmCity = document.getElementById('lm-city').value.trim();`;
const saveConfirmedStr = `\n            const confirmedEl = document.getElementById('lm-confirmed');\n            const lmConfirmed = confirmedEl ? confirmedEl.checked : false;`;

if (!mainJs.includes('lmConfirmed = ')) {
    mainJs = mainJs.replace(saveCityStr, saveCityStr + saveConfirmedStr);
}

const lmDataOldStr = `const lmData = { type: lmType, coords: normalizeCoords(lmCoords), note: lmNote, country: lmCountry, city: lmCity, timestamp: Date.now() };`;
const lmDataNewStr = `const lmData = { type: lmType, coords: normalizeCoords(lmCoords), note: lmNote, country: lmCountry, city: lmCity, confirmed: lmConfirmed, timestamp: Date.now() };`;

mainJs = mainJs.replace(lmDataOldStr, lmDataNewStr);

// Update save logic to clear confirmed state
const clearCityStr = `document.getElementById('lm-city').value = '';`;
const clearConfirmedStr = `\n            const confirmedEl2 = document.getElementById('lm-confirmed');\n            if (confirmedEl2) confirmedEl2.checked = false;`;

if (!mainJs.includes('confirmedEl2')) {
    mainJs = mainJs.replace(clearCityStr, clearCityStr + clearConfirmedStr);
}

fs.writeFileSync(mainPath, mainJs, 'utf-8');
console.log('Updated js/main.js');

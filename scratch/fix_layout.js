const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// Fix layout issue by replacing the newline that might be causing layout gaps
const brokenStr = `                        <span class="lm-type-pill">\${escapeHtml(item.type)}</span>\n                        \${item.confirmed ? '<span style="background:#dcfce7; color:#166534; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:bold; margin-left:6px;">✅ 已確認</span>' : ''}`;
const fixedStr = `                        <span class="lm-type-pill">\${escapeHtml(item.type)}</span>\${item.confirmed ? '<span style="background:#dcfce7; color:#166534; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:bold; margin-left:6px; display:inline-block; white-space:nowrap;">✅ 已確認</span>' : ''}`;

if (mainJs.includes(brokenStr)) {
    mainJs = mainJs.replace(brokenStr, fixedStr);
    console.log('Fixed whitespace in makeLmCard');
} else {
    console.log('Could not find broken string in makeLmCard');
}

// Add CSS fix to prevent wrapping in lm-nav-card if it's there
const cssFix = `
    const css = '.lm-nav-card { flex-wrap: nowrap !important; } .lm-nav-left { min-width: 0; } .lm-nav-right { flex-shrink: 0; }';
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
`;
if (!mainJs.includes('lm-nav-card { flex-wrap: nowrap')) {
    mainJs += '\n' + cssFix;
}

// Add debug logging for save
const saveLogicStr = `const lmData = { type: lmType, coords: normalizeCoords(lmCoords), note: lmNote, country: lmCountry, city: lmCity, confirmed: lmConfirmed, timestamp: Date.now() };`;
const fixedSaveLogicStr = `const lmData = { type: lmType, coords: normalizeCoords(lmCoords), note: lmNote, country: lmCountry, city: lmCity, confirmed: lmConfirmed, timestamp: Date.now() };
            console.log('Saving lmData:', lmData);`;

if (mainJs.includes(saveLogicStr) && !mainJs.includes('Saving lmData:')) {
    mainJs = mainJs.replace(saveLogicStr, fixedSaveLogicStr);
    console.log('Added save logic logging');
}

// Force a version bump
mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

console.log('Updated main.js and index.html');

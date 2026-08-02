const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. Move categoryIcons and getTypeEmoji out of renderLandmarks
// Find where it currently is:
const emojiRegex = /\s*const categoryIcons = \{[\s\S]*?function getTypeEmoji\(type\) \{[\s\S]*?return '📍 ';\s*\}/;
const match = mainJs.match(emojiRegex);
if (match) {
    mainJs = mainJs.replace(emojiRegex, '');
    // Insert it before function renderLandmarks()
    mainJs = mainJs.replace('function renderLandmarks() {', match[0].trim() + '\n\n    function renderLandmarks() {');
    console.log('Moved getTypeEmoji to global scope');
}

// 2. Fix the filter types in updateMapMarkers
const oldTypesCode = `        if (typeof landmarkList !== "undefined" && landmarkList) {
            landmarkList.forEach(lm => { if(lm.type) types.add(lm.type); });
        }`;
const newTypesCode = `        if (typeof landmarkList !== "undefined" && landmarkList && landmarkList.length > 0) {
            types.add('純點');
        }`;
if (mainJs.includes(oldTypesCode)) {
    mainJs = mainJs.replace(oldTypesCode, newTypesCode);
    console.log('Updated filter types');
}

// 3. Fix the filter condition in updateMapMarkers for landmarks
const oldLmFilter = `if (selectedType !== 'all' && lm.type !== selectedType) return;`;
const newLmFilter = `if (selectedType !== 'all' && selectedType !== '純點') return;`;
if (mainJs.includes(oldLmFilter)) {
    mainJs = mainJs.replace(oldLmFilter, newLmFilter);
    console.log('Updated landmark filter condition');
}

mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

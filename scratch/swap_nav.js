const fs = require('fs');
const path = require('path');
const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const mapRegex = /<button class="nav-item" id="nav-map"[\s\S]*?<\/button>/;
const landmarkRegex = /<button class="nav-item" id="nav-landmark"[\s\S]*?<\/button>/;

const mapMatch = indexHtml.match(mapRegex);
const landmarkMatch = indexHtml.match(landmarkRegex);

if (mapMatch && landmarkMatch) {
    // We will do a generic replace
    let temp = indexHtml.replace(mapRegex, '%%MAP_PLACEHOLDER%%');
    temp = temp.replace(landmarkRegex, mapMatch[0]);
    temp = temp.replace('%%MAP_PLACEHOLDER%%', landmarkMatch[0]);
    
    // Also bump version
    temp = temp.replace(/const APP_VERSION = "[^"]+";/, `const APP_VERSION = "2026.07.31.0432";`);
    temp = temp.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
    
    fs.writeFileSync(indexHtmlPath, temp, 'utf-8');
    console.log('Successfully swapped nav items');
} else {
    console.log('Failed to find nav items');
}

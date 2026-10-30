const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const endPattern = '<!-- 回到定位按鈕 -->';
let sIdx = html.indexOf('<div id="route-panel"');
let eIdx = html.indexOf(endPattern);

if (sIdx !== -1 && eIdx !== -1) {
    console.log(html.slice(eIdx - 200, eIdx + 50));
}

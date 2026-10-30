const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<div id="route-panel"');
let eIdx = html.indexOf('<!-- 分類篩選 -->');
if (sIdx !== -1 && eIdx !== -1) {
    console.log(html.slice(sIdx - 100, eIdx + 100));
}

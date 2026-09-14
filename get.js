const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf('        const actionBtnStyle =');
const end = js.indexOf('            ${isFull ? `<div style="position:absolute; inset:0;');
console.log(js.substring(idx, end));

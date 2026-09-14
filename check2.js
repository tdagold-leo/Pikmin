const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

const idx = js.indexOf('function updateView()');
let openBraces = 0;
let i = idx;
let foundBody = false;

while (i < js.length) {
    if (js[i] === '{') {
        openBraces++;
        foundBody = true;
    } else if (js[i] === '}') {
        openBraces--;
    }
    i++;
    if (foundBody && openBraces === 0) break;
}
const code = js.substring(idx, i);
const regex = /getElementById\(['"]([^'"]+)['"]\)/g;
let m;
const ids = new Set();
while(m = regex.exec(code)) {
    ids.add(m[1]);
}
console.log(Array.from(ids));

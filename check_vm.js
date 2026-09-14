const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
let s = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="view-mushroom"')) s = true;
    if (s) {
        console.log(lines[i]);
        if (lines[i].includes('search-input')) break;
    }
}

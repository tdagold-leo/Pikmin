const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf("cdVal = '30';");
const idx2 = js.indexOf("cdVal = '30';", idx + 1);
console.log(js.substring(idx2 - 100, idx2 + 2000));

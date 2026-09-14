const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf("if (currentMode === 'postcard' || currentMode === 'goldbasin') {");
console.log(js.substring(idx, idx + 800));

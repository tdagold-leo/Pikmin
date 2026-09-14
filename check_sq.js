const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf("ah.className = 'sq-group-header';");
const end = js.indexOf("if (!isActCol)", idx);
console.log(js.substring(idx - 100, end));

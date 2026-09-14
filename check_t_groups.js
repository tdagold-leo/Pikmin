const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf("topGroups['絕版'].push(item);");
console.log(js.substring(idx - 100, idx + 2000));

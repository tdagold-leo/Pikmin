const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf("pcGroups[type]");
console.log(js.substring(idx - 1000, idx + 1000));

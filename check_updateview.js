const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf("function updateView() {");
console.log(js.substring(idx, idx + 1000));

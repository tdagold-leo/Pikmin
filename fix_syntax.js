const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/\\\`background-image:/g, '\`background-image:');
js = js.replace(/background-repeat:no-repeat;\\\`/g, 'background-repeat:no-repeat;\`');
fs.writeFileSync('js/main.js', js);
console.log('Fixed');

const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../js/main.js');
let code = fs.readFileSync(mainJsPath, 'utf-8');

// Fix trailing backtick at line 3172
code = code.replace('            }`\n            card.innerHTML = `', '            }\n            card.innerHTML = `');

fs.writeFileSync(mainJsPath, code, 'utf-8');
console.log('Fixed trailing backtick in main.js');

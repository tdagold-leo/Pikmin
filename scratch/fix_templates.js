const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

mainJs = mainJs.replace(/const todayStr = \$\{y\}--;/g, 'const todayStr = `${y}-${m}-${d}`;');
mainJs = mainJs.replace(/el\.value = \$\{y\}--;/g, 'el.value = `${y}-${m}-${d}`;');

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
console.log("Fixed template strings");

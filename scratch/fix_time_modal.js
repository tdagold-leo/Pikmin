const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

mainJs = mainJs.split("document.getElementById('edit-time-modal')").join("document.getElementById('time-modal')");
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
console.log("Updated time-modal ID references");

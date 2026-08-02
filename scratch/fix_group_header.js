const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /<span>\$\{arrow\} 📂 \$\{escapeHtml\(type\)\}<\/span>/g;
const replaceStr = `<span>\${arrow} \${getTypeEmoji(type)}\${escapeHtml(type)}</span>`;

if (regex.test(mainJs)) {
    mainJs = mainJs.replace(regex, replaceStr);
    console.log('Successfully updated group header to use emoji');
} else {
    console.log('Could not find regex match');
}

mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

const fs = require('fs');
const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const target = `const icon = item.isLocal ? '🔒 ' : '';`;
const replacement = `const icon = item.isLocal ? '🔒 ' : '🌐 ';`;

if (jsContent.includes(target)) {
    jsContent = jsContent.replace(target, replacement);
    fs.writeFileSync(jsFile, jsContent, 'utf-8');
    console.log('main.js updated successfully.');
} else {
    console.log('Target string not found in main.js');
}

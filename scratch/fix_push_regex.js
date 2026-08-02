const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /city: cloudData\[key\]\.city \|\| '',\s*timestamp: cloudData\[key\]\.timestamp \|\| 0/;
const replaceStr = `city: cloudData[key].city || '',
                    confirmed: cloudData[key].confirmed || false,
                    timestamp: cloudData[key].timestamp || 0`;

if (regex.test(mainJs)) {
    mainJs = mainJs.replace(regex, replaceStr);
    console.log('Successfully fixed landmarkList.push');
} else {
    console.log('Failed to find regex match');
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("document.createElement('div')")) {
        console.log(`Line ${i}: ${lines[i].trim()}`);
        console.log(`   Class: ${lines[i+1].trim()}`);
    }
}

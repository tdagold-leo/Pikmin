const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
// Check all places that call updateView()
let count = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('updateView()') || lines[i].includes('updateView(')) {
        console.log(`L${i+1}: ${lines[i].trim()}`);
        count++;
    }
}
console.log('\nTotal updateView calls:', count);

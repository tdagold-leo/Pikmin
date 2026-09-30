const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
// Find renderMGroup function
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function renderMGroup')) {
        for (let j = i; j < Math.min(lines.length, i+40); j++) {
            console.log(`L${j+1}: ${lines[j]}`);
        }
        break;
    }
}

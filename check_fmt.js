const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function formatLineText') || lines[i].includes('formatLineText')) {
        console.log(`Line ${i}: ${lines[i].trim()}`);
    }
}

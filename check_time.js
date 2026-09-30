const fs = require('fs');
const js = fs.readFileSync('js/autofill.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('剩下') || lines[i].includes('日') || lines[i].includes('時') || lines[i].includes('parseTime') || lines[i].includes('remaining')) {
        console.log(`Line ${i}: ${lines[i]}`);
    }
}

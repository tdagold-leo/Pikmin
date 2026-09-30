const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('剩下') || lines[i].includes('parseTime') || lines[i].includes('remaining') || lines[i].includes('parseRemainingTime') || lines[i].includes('days') || lines[i].includes('hours')) {
        console.log(`Line ${i}: ${lines[i]}`);
    }
}

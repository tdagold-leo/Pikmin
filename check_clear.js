const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    // Check container clear logic
    if (lines[i].includes('innerHTML = \'\'') || lines[i].includes('innerHTML=""') || lines[i].includes('.innerHTML = ""') || lines[i].includes('activeEl') || lines[i].includes('unclaimEl') || lines[i].includes('view-mushroom-active') || lines[i].includes('view-mushroom-unclaim')) {
        console.log(`L${i+1}: ${lines[i].trim()}`);
    }
}

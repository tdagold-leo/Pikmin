const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('mushroom_pins') || lines[i].includes('pinnedMushroomsSet') || lines[i].includes('pinnedMushrooms') || lines[i].includes('mush-pin') || lines[i].includes('pinned-list') || lines[i].includes('pinnedGrid')) {
        console.log(`L${i+1}: ${lines[i].trim()}`);
    }
}

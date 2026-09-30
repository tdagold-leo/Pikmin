const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

// Find card name, slot size, avatar, copy button
const keywords = ['mush-name', 'card-name', 'slot-btn', 'aspect-ratio', 'avatar-circle', 'btn-copy', 'line-copy', '複製', 'copy-btn', 'createMushroomCard'];
for (let i = 0; i < lines.length; i++) {
    for (const kw of keywords) {
        if (lines[i].includes(kw)) {
            console.log(`L${i+1}: ${lines[i].trim().substring(0, 120)}`);
            break;
        }
    }
}

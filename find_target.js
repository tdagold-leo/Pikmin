const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('id="post-tag-container"'));
if (idx !== -1) {
    console.log('Found post-tag-container at line', idx + 1);
    console.log(lines.slice(idx - 10, idx + 15).join('\n'));
}

const eIdx = lines.findIndex(l => l.includes('id="edit-post-tag-container"'));
if (eIdx !== -1) {
    console.log('Found edit-post-tag-container at line', eIdx + 1);
    console.log(lines.slice(eIdx - 10, eIdx + 15).join('\n'));
}

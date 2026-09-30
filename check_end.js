const fs = require('fs');
const html = fs.readFileSync('ocr.html', 'utf8');
const lines = html.split('\n');
let s = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="drop-zone"')) s = true;
    if (s) {
        console.log(lines[i]);
        if (lines[i].includes('</label>') || lines[i].includes('</div>') && lines[i].includes('file-input')) break;
    }
}

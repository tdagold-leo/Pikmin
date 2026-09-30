const fs = require('fs');
const html = fs.readFileSync('ocr.html', 'utf8');
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="file-input"')) {
        console.log(lines[i]);
    }
}

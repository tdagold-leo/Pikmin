const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let s = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="view-settings"')) s = true;
    if (s) {
        console.log(lines[i]);
        if (lines[i].includes('</section>')) break;
    }
}

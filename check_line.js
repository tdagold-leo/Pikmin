const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('onclick="shareToLineWindow()"')) {
        console.log(lines[i]);
    }
}

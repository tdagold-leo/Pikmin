const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('type="file"')) {
        for (let j = Math.max(0, i-5); j < i+5; j++) {
            console.log(lines[j]);
        }
        console.log('---');
    }
}

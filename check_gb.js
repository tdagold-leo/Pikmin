const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="view-goldbasin"')) {
        for(let j=i; j<i+30; j++) console.log(lines[j]);
        break;
    }
}

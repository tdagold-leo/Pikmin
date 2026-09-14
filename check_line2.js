const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('function shareToLineWindow')) {
        for(let j=Math.max(0, i-2); j<i+20; j++) console.log(lines[j]);
        break;
    }
}

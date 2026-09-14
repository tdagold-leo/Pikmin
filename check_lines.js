const fs = require('fs');
const lines = fs.readFileSync('js/main.js', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('isFull ?')) {
        for (let j = i - 10; j <= i + 5; j++) {
            console.log(j + ': ' + lines[j]);
        }
        break;
    }
}

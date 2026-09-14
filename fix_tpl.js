const fs = require('fs');
const lines = fs.readFileSync('js/main.js', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('\`;')) {
        if (lines[i + 1] && lines[i + 1].includes('${isFull ?')) {
            lines.splice(i, 1);
            break;
        }
    }
}

fs.writeFileSync('js/main.js', lines.join('\n'));
console.log('Fixed early template literal termination');

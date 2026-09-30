const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('重複收藏') || lines[i].includes('duplicate') || lines[i].includes('dataList.push') || lines[i].includes('dataList = []') || lines[i].includes('dataList.length')) {
        console.log(`Line ${i + 1}: ${lines[i]}`);
    }
}

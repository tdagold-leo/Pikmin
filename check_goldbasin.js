const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf("if (isGoldbasinMode && type === '特殊金盆') {");
if(idx !== -1) {
    const end = js.indexOf("if (!isSubCol) {", idx);
    console.log(js.substring(idx - 100, end+100));
} else {
    console.log('not found');
}

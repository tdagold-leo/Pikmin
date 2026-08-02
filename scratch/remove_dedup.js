const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

if (indexHtml.includes('<script src="js/dedup.js?v=1"></script>')) {
    indexHtml = indexHtml.replace('<script src="js/dedup.js?v=1"></script>', '');
    fs.writeFileSync(indexPath, indexHtml, 'utf-8');
    console.log('Removed dedup.js from index.html');
} else {
    console.log('dedup.js not found');
}

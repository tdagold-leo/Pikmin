const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const idx = js.indexOf('<div class="card-body"');
const end = js.indexOf('            ${isFull ?');
console.log(js.substring(idx, end));

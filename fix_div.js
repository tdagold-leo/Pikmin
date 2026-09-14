const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace('</div>\\n            </div></div>\\n            ${isFull ?', '</div>\\n            </div>\\n            ${isFull ?');
fs.writeFileSync('js/main.js', js);

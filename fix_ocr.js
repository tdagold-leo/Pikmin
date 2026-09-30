const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

// Change div to label
html = html.replace('<div id="drop-zone">', '<label id="drop-zone" for="file-input">');
html = html.replace('</label>\n    </div>', '</label>\n    </div>'); // Wait, the original end tag is `</div>`
html = html.replace('    <input type="file" id="file-input" accept="image/*" multiple>\n    </div>', '    <input type="file" id="file-input" accept="image/*" multiple>\n    </label>');

// Remove JS click listener
html = html.replace("dropZone.addEventListener('click', () => fileInput.click());", "// Native label handles click");

fs.writeFileSync('ocr.html', html);
console.log('Fixed ocr.html');

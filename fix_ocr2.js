const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

// Revert label to div and add inline onclick
html = html.replace('<label id="drop-zone" for="file-input">', '<div id="drop-zone" onclick="document.getElementById(\'file-input\').click()">');
html = html.replace('</label>', '</div>');

// Ensure JS event listener is removed (it was already commented out, but just to be sure)
html = html.replace("// Native label handles click", "");
html = html.replace("dropZone.addEventListener('click', () => fileInput.click());", "");

fs.writeFileSync('ocr.html', html);
console.log('Fixed ocr.html to use inline onclick');

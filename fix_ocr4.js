const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

// Inject CSS
const newCss = `
        #drop-zone {
            position: relative;
            overflow: hidden;
        }
        #file-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            display: block !important;
            z-index: 10;
        }
`;
html = html.replace('#file-input { display: none; }', newCss);

// Remove onclick from drop-zone since it's now covered by the input itself
html = html.replace('<div id="drop-zone" onclick="document.getElementById(\'file-input\').click()">', '<div id="drop-zone">');

fs.writeFileSync('ocr.html', html);
console.log('Fixed opacity');

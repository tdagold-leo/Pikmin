const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

// Change file-input to have inline onchange
html = html.replace('<input type="file" id="file-input" accept="image/*" multiple>', '<input type="file" id="file-input" accept="image/*" multiple style="display:none;" onchange="if(this.files.length > 0) handleFiles(this.files)">');

// Remove JS change listener
html = html.replace(`    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) handleFiles(fileInput.files);
    });`, '');

fs.writeFileSync('ocr.html', html);
console.log('Fixed onchange');

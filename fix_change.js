const fs = require('fs');
let html = fs.readFileSync('ocr.html', 'utf8');

// Remove inline onchange from file-input
html = html.replace(' onchange="if(this.files.length > 0) handleFiles(this.files)"', '');

// Add JS event listener
const listener = `
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    async function handleFiles`;
html = html.replace('    async function handleFiles', listener);

fs.writeFileSync('ocr.html', html);
console.log('Fixed change listener');

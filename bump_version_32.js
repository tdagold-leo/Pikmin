const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// The goal is to lift the let/const declarations for autoFilled, nameField, coordsField, tagField outside the first if (isPostcard) block.

const searchString1 = `                if (isPostcard) {
                    let autoFilled = [];
                    const nameField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-name' : 'edit-post-name');
                    const coordsField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-coords' : 'edit-post-coords');
                    const tagField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-tag' : 'edit-post-tag');`;

const replaceString1 = `                let autoFilled = [];
                let nameField = null;
                let coordsField = null;
                let tagField = null;
                
                if (isPostcard) {
                    nameField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-name' : 'edit-post-name');
                    coordsField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-coords' : 'edit-post-coords');
                    tagField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-tag' : 'edit-post-tag');`;

const searchString2 = `                } else if (isMushroom) {
                    let autoFilled = [];
                    const tagField = document.getElementById('tag');`;

const replaceString2 = `                } else if (isMushroom) {
                    tagField = document.getElementById('tag');`;


if (js.includes(searchString1) && js.includes(searchString2)) {
    js = js.replace(searchString1, replaceString1);
    js = js.replace(searchString2, replaceString2);
    
    // Also, bump the version
    js = js.replace(/v=\d{10,14}/g, 'v=202610110235');
    fs.writeFileSync('js/main.js', js);
    
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0235"');
    html = html.replace(/v=\d{10,14}/g, 'v=202610110235');
    fs.writeFileSync('index.html', html);
    
    console.log('Fixed OCR scope bug');
} else {
    console.log('Could not find strings in js/main.js');
}

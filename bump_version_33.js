const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const p1 = js.indexOf('let displayHtml = `<div style=');
if (p1 !== -1) {
    const p2 = js.indexOf('if (isPostcard) {', p1);
    const p3 = js.indexOf('if (lines.length > 0) {', p2);
    const textToReplace = js.slice(p2, p3);
    
    let newText = `let autoFilled = [];
                let nameField = null;
                let coordsField = null;
                let tagField = null;
                
                if (isPostcard) {
                    nameField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-name' : 'edit-post-name');
                    coordsField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-coords' : 'edit-post-coords');
                    tagField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-tag' : 'edit-post-tag');
                    
                    `;
    js = js.replace(textToReplace, newText);
    
    // Now fix isMushroom
    const p4 = js.indexOf('} else if (isMushroom) {');
    const p5 = js.indexOf('const regexType', p4);
    const mushTextToReplace = js.slice(p4, p5);
    
    const newMushText = `} else if (isMushroom) {
                    tagField = document.getElementById('tag');
                    
                    `;
    js = js.replace(mushTextToReplace, newMushText);
    
    js = js.replace(/v=\d{10,14}/g, 'v=202610110235');
    fs.writeFileSync('js/main.js', js);
    
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0235"');
    html = html.replace(/v=\d{10,14}/g, 'v=202610110235');
    fs.writeFileSync('index.html', html);
    
    console.log('Fixed');
}

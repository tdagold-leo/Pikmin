const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const s1 = `                let displayHtml = \`<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-weight:bold;"><span>✅ 辨識成功：</span><button class="btn-sm btn-default" style="padding:2px 6px; font-size:10px;" onclick="navigator.clipboard.writeText(this.parentElement.nextSibling.innerText); const o=this.innerText; this.innerText='已複製'; setTimeout(()=>{this.innerText=o},2000)">複製全部</button></div><div style="user-select:text;">\${escapeHtml(limitedText)}</div>\`;
                
                if (isPostcard) {
                    let autoFilled = [];
                    const nameField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-name' : 'edit-post-name');
                    const coordsField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-coords' : 'edit-post-coords');
                    const tagField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-tag' : 'edit-post-tag');`;

const r1 = `                let displayHtml = \`<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-weight:bold;"><span>✅ 辨識成功：</span><button class="btn-sm btn-default" style="padding:2px 6px; font-size:10px;" onclick="navigator.clipboard.writeText(this.parentElement.nextSibling.innerText); const o=this.innerText; this.innerText='已複製'; setTimeout(()=>{this.innerText=o},2000)">複製全部</button></div><div style="user-select:text;">\${escapeHtml(limitedText)}</div>\`;
                
                let autoFilled = [];
                let nameField = null;
                let coordsField = null;
                let tagField = null;
                
                if (isPostcard) {
                    nameField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-name' : 'edit-post-name');
                    coordsField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-coords' : 'edit-post-coords');
                    tagField = document.getElementById(resultDivId === 'post-ocr-result' ? 'post-tag' : 'edit-post-tag');`;

const s2 = `                } else if (isMushroom) {
                    let autoFilled = [];
                    const tagField = document.getElementById('tag');`;

const r2 = `                } else if (isMushroom) {
                    tagField = document.getElementById('tag');`;

if (js.includes(s1) && js.includes(s2)) {
    js = js.replace(s1, r1);
    js = js.replace(s2, r2);
    js = js.replace(/v=\d{10,14}/g, 'v=202610110245');
    fs.writeFileSync('js/main.js', js);
    console.log('Fixed js scope!');
} else {
    console.log('Could not find strings for replacement');
}

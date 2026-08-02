const fs = require('fs');

// Patch index.html
const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const htmlTarget = '<span>複製驗證碼</span>';
const htmlReplacement = '<span>複製驗證碼 & 開啟 Pikmin</span>';
if (indexContent.includes(htmlTarget)) {
    indexContent = indexContent.replace(htmlTarget, htmlReplacement);
    fs.writeFileSync(indexFile, indexContent, 'utf-8');
    console.log('index.html updated.');
} else {
    console.log('index.html target not found.');
}

// Patch main.js
const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const jsTarget = 'copyCodeBtn.onclick = () => copyToClipboard(verificationCode, copyCodeBtn);';
const jsReplacement = `copyCodeBtn.onclick = () => {
                        copyToClipboard(verificationCode, copyCodeBtn);
                        const openBtn = document.getElementById('cloud-openPikminBtn');
                        if (openBtn) window.location.href = openBtn.href;
                    };`;

if (jsContent.includes(jsTarget)) {
    jsContent = jsContent.replace(jsTarget, jsReplacement);
    fs.writeFileSync(jsFile, jsContent, 'utf-8');
    console.log('main.js updated.');
} else {
    console.log('main.js target not found.');
}

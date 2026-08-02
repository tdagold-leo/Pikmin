const fs = require('fs');
const path = require('path');

// 1. Fix index.html
const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const oldScriptTag = /<script src="js\/main\.min\.js\?v=\d+"><\/script>/;
const newScriptTags = `<script src="js/main.js?v=1785599500000"></script>\n    <script src="js/autofill.js?v=1785599500000"></script>`;

if (oldScriptTag.test(indexHtml)) {
    indexHtml = indexHtml.replace(oldScriptTag, newScriptTags);
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
    console.log("Successfully fixed script tags in index.html");
} else {
    console.log("oldScriptTag not found in index.html, checking if js/main.js is already there");
    if (!indexHtml.includes('js/autofill.js')) {
        indexHtml = indexHtml.replace(/<script src="js\/main\.js\?v=\d+"><\/script>/, newScriptTags);
        fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
        console.log("Added autofill.js to index.html");
    }
}

// 2. Make upload_to_github.ps1 resilient
const ps1Path = path.join(__dirname, '../upload_to_github.ps1');
let ps1 = fs.readFileSync(ps1Path, 'utf-8');
ps1 = ps1.replace(/\$htmlContent = \$htmlContent -replace 'js\/main\\\.js\\\?v=\\d\+',/g, "$htmlContent = $htmlContent -replace 'js/main(\\.min)?\\.js\\?v=\\d+',");
fs.writeFileSync(ps1Path, ps1, 'utf-8');
console.log("upload_to_github.ps1 updated to be regex resilient");

const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. Replace 'edit-modal' with 'edit-time-modal'
mainJs = mainJs.split("document.getElementById('edit-modal')").join("document.getElementById('edit-time-modal')");

// 2. Add setTodayDate if not present
if (!mainJs.includes('function setTodayDate')) {
    mainJs += `

    function setTodayDate(inputId) {
        const el = document.getElementById(inputId);
        if (!el) return;
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        el.value = \`\${y}-\${m}-\${d}\`;
    }
    window.setTodayDate = setTodayDate;
`;
    console.log("Added setTodayDate function");
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
console.log("main.js updated");

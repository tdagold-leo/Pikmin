const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const regex = /if \(btn\) btn\.innerText = '確定修改';\s*document\.getElementById\('add-modal'\)\.style\.display = 'flex';\s*\}/;
const replaceStr = `if (btn) btn.innerText = '確定修改';
        const deleteBtn = document.getElementById('add-modal-delete-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'block';
            deleteBtn.onclick = () => {
                if (confirm('確定要刪除此筆純點紀錄嗎？')) {
                    deleteLandmark(id);
                    closeModal('add-modal');
                }
            };
        }
        document.getElementById('add-modal').style.display = 'flex';
    }`;

if (regex.test(mainJs)) {
    mainJs = mainJs.replace(regex, replaceStr);
    console.log('Successfully injected show logic into editLandmark');
} else {
    console.log('Failed to match regex for editLandmark');
}

mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

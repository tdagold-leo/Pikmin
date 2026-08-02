const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. Remove delete button from card
const targetDelBtn = `<button class="lm-icon-btn del"  onclick="deleteLandmark('\${item.id}')">🗑️</button>`;
if (mainJs.includes(targetDelBtn)) {
    mainJs = mainJs.replace(targetDelBtn, '');
    console.log('Removed delete button from makeLmCard');
} else {
    console.log('Delete button not found in makeLmCard');
}

// 2. Hide delete button in openAddModal
const openAddModalStr = `    function openAddModal() {
        if (typeof editingLandmarkId !== 'undefined') editingLandmarkId = null;`;
const openAddModalFix = `    function openAddModal() {
        if (typeof editingLandmarkId !== 'undefined') editingLandmarkId = null;
        const deleteBtn = document.getElementById('add-modal-delete-btn');
        if (deleteBtn) deleteBtn.style.display = 'none';`;
if (mainJs.includes(openAddModalStr)) {
    mainJs = mainJs.replace(openAddModalStr, openAddModalFix);
    console.log('Added hide logic to openAddModal');
}

// 3. Show delete button and attach logic in editLandmark
const editLandmarkEndStr = `        // 修改按鈕文字
        const btn = document.querySelector('#add-modal .btn-primary');
        if (btn) btn.innerText = '確定修改';
        document.getElementById('add-modal').style.display = 'flex';
    }`;
const editLandmarkEndFix = `        // 修改按鈕文字
        const btn = document.querySelector('#add-modal .btn-primary');
        if (btn) btn.innerText = '確定修改';

        const deleteBtn = document.getElementById('add-modal-delete-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'block';
            deleteBtn.onclick = () => {
                if (confirm('確定要刪除此純點紀錄嗎？')) {
                    deleteLandmark(id);
                    closeModal('add-modal');
                }
            };
        }

        document.getElementById('add-modal').style.display = 'flex';
    }`;
if (mainJs.includes(editLandmarkEndStr)) {
    mainJs = mainJs.replace(editLandmarkEndStr, editLandmarkEndFix);
    console.log('Added show logic to editLandmark');
}

// Bump version
mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
console.log('Updated index.html to force reload');

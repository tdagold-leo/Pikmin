const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// Replace the static chips in index.html
const oldChipsRegex = /<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:2px;">[\s\S]*?<\/div>/;
const newChipsHtml = `<div id="quick-search-chips" style="display:flex; flex-wrap:wrap; gap:6px; margin-top:2px;">
                    <button type="button" onclick="document.getElementById('postcard-search').value = '缺'; updateView();" style="padding:4px 10px; border-radius:12px; border:1px solid #fca5a5; background:#fef2f2; font-size:12px; cursor:pointer; color:#b91c1c;">⚠️ 缺</button>
                </div>`;

if (indexHtml.match(oldChipsRegex)) {
    indexHtml = indexHtml.replace(oldChipsRegex, newChipsHtml);
    
    // update cache buster
    indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
    indexHtml = indexHtml.replace(/const APP_VERSION = "[^"]+";/, `const APP_VERSION = "2026.08.01.1915";`);
    
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
    console.log("Updated index.html");
}

// Now update main.js
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// Add the dynamic chips logic
// We can just append it to the end of main.js
const dynamicChipsLogic = `

// --- 動態常用搜尋字紀錄 ---
function renderQuickSearchChips() {
    const container = document.getElementById('quick-search-chips');
    if (!container) return;
    
    // 保留原本的「缺」按鈕
    container.innerHTML = \`<button type="button" onclick="document.getElementById('postcard-search').value = '缺'; updateView();" style="padding:4px 10px; border-radius:12px; border:1px solid #fca5a5; background:#fef2f2; font-size:12px; cursor:pointer; color:#b91c1c;">⚠️ 缺</button>\`;
    
    try {
        let history = JSON.parse(localStorage.getItem('pikmin_recent_searches') || '[]');
        history.forEach(term => {
            if(term === '缺') return; // Skip if it's the default one
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerText = term;
            btn.style.cssText = "padding:4px 10px; border-radius:12px; border:1px solid #d1d5db; background:#f9fafb; font-size:12px; cursor:pointer; color:var(--text-main); display:flex; align-items:center; gap:4px;";
            
            // Delete button for this history item
            const delBtn = document.createElement('span');
            delBtn.innerHTML = "&times;";
            delBtn.style.cssText = "color:#9ca3af; font-size:14px; margin-left:4px;";
            delBtn.onclick = (e) => {
                e.stopPropagation();
                removeSearchHistory(term);
            };
            
            btn.onclick = () => {
                document.getElementById('postcard-search').value = term;
                updateView();
                recordSearchHistory(term); // Bump it
            };
            
            btn.appendChild(delBtn);
            container.appendChild(btn);
        });
    } catch(e){}
}

function recordSearchHistory(term) {
    if (!term || term.trim() === '' || term.trim() === '缺') return;
    term = term.trim();
    try {
        let history = JSON.parse(localStorage.getItem('pikmin_recent_searches') || '[]');
        history = history.filter(t => t !== term); // Remove if exists to move to front
        history.unshift(term);
        if (history.length > 8) history = history.slice(0, 8); // Keep max 8
        localStorage.setItem('pikmin_recent_searches', JSON.stringify(history));
        renderQuickSearchChips();
    } catch(e){}
}

function removeSearchHistory(term) {
    try {
        let history = JSON.parse(localStorage.getItem('pikmin_recent_searches') || '[]');
        history = history.filter(t => t !== term);
        localStorage.setItem('pikmin_recent_searches', JSON.stringify(history));
        renderQuickSearchChips();
    } catch(e){}
}

// Bind to search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('postcard-search');
    if (searchInput) {
        // Record on change (when enter is pressed or focus is lost)
        searchInput.addEventListener('change', (e) => {
            recordSearchHistory(e.target.value);
        });
    }
    renderQuickSearchChips();
});

// Also trigger initial render in case DOM is already loaded
if(document.readyState === 'complete' || document.readyState === 'interactive') {
    renderQuickSearchChips();
    const searchInput = document.getElementById('postcard-search');
    if (searchInput) {
        searchInput.removeEventListener('change', recordSearchHistory);
        searchInput.addEventListener('change', (e) => recordSearchHistory(e.target.value));
    }
}
`;

if (!mainJs.includes('function renderQuickSearchChips')) {
    mainJs += dynamicChipsLogic;
    fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
    console.log("Updated main.js");
} else {
    console.log("main.js already has the logic");
}


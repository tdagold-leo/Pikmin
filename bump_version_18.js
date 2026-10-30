const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

// Update renderCloudRoutes
const sRender = `                    <button class="btn-sm" onclick="loadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:4px;" title="顯示在地圖">👁️</button>
                    <button class="btn-sm" onclick="downloadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; border-radius:4px;" title="下載">💾</button>
                    \${r.uploaderId === window.currentUserUid ? \`<button class="btn-sm" onclick="deleteCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:4px;" title="刪除">🗑️</button>\` : ''}`;

const rRender = `                    <button class="btn-sm" onclick="loadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:4px;" title="顯示在地圖">👁️</button>
                    <button class="btn-sm" onclick="downloadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; border-radius:4px;" title="下載">💾</button>
                    \${r.uploaderId === window.currentUserUid ? \`<button class="btn-sm" onclick="renameCloudRoute('\${r.key}', '\${escapeHtml(r.name || '').replace(/'/g, "\\\\'")}')" style="padding:2px 4px; font-size:12px; color:#d97706; border:1px solid #fcd34d; background:#fffbeb; border-radius:4px;" title="重新命名">✏️</button><button class="btn-sm" onclick="deleteCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:4px;" title="刪除">🗑️</button>\` : ''}`;

if (js.includes(sRender)) {
    js = js.replace(sRender, rRender);
} else {
    console.log("Could not find sRender");
}

// Add renameCloudRoute function
const sDelete = `    window.deleteCloudRoute = function(key) {
        if (confirm('確定要刪除這條分享的路線嗎？')) {
            dbRef('routes/' + key).remove();
        }
    };`;

const rDelete = `    window.renameCloudRoute = function(key, currentName) {
        const newName = prompt('請輸入新的路線名稱：', currentName);
        if (newName !== null && newName.trim() !== '' && newName.trim() !== currentName) {
            dbRef('routes/' + key).update({ name: newName.trim() });
        }
    };

    window.deleteCloudRoute = function(key) {
        if (confirm('確定要刪除這條分享的路線嗎？')) {
            dbRef('routes/' + key).remove();
        }
    };`;

if (js.includes(sDelete)) {
    js = js.replace(sDelete, rDelete);
} else {
    console.log("Could not find sDelete");
}

// Export it
const sExport = `window.deleteCloudRoute = deleteCloudRoute;`;
const rExport = `window.deleteCloudRoute = deleteCloudRoute;\nwindow.renameCloudRoute = renameCloudRoute;`;
if (js.includes(sExport)) {
    js = js.replace(sExport, rExport);
}

fs.writeFileSync('js/main.js', js);
console.log("js/main.js patched");

// Bump version
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2310"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092310');
fs.writeFileSync('index.html', html);
console.log("index.html bumped");

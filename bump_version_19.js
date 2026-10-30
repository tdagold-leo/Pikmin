const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// Update renderCloudRoutes
const sRender = `            const titleFull = (r.name || '未命名') + countStr;
            html += \`
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:4px 6px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${escapeHtml(titleFull)}">\${escapeHtml(r.name || '未命名')}<span style="color:#64748b; font-weight:normal; font-size:11px; margin-left:2px;">\${countStr}</span></span>
                    <span style="font-size:9px; color:#94a3b8;">\${dateStr}</span>
                </div>
                <div style="display:flex; gap:2px;">
                    <button class="btn-sm" onclick="loadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:4px;" title="顯示在地圖">👁️</button>
                    <button class="btn-sm" onclick="downloadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; border-radius:4px;" title="下載">💾</button>
                    \${r.uploaderId === window.currentUserUid ? \`<button class="btn-sm" onclick="renameCloudRoute('\${r.key}', '\${escapeHtml(r.name || '').replace(/'/g, "\\\\'")}')" style="padding:2px 4px; font-size:12px; color:#d97706; border:1px solid #fcd34d; background:#fffbeb; border-radius:4px;" title="重新命名">✏️</button><button class="btn-sm" onclick="deleteCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:4px;" title="刪除">🗑️</button>\` : ''}
                </div>
            </div>\`;`;
            
const rRender = `            const titleFull = (r.name || '未命名') + countStr;
            const myName = localStorage.getItem('pikmin_custom_name') || 'unknown';
            const canEdit = !r.uploaderId || r.uploaderId === 'unknown' || r.uploaderId === myName;
            html += \`
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:4px 6px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${escapeHtml(titleFull)}">\${escapeHtml(r.name || '未命名')}<span style="color:#64748b; font-weight:normal; font-size:11px; margin-left:2px;">\${countStr}</span></span>
                    <span style="font-size:9px; color:#94a3b8;">\${dateStr}</span>
                </div>
                <div style="display:flex; gap:2px;">
                    <button class="btn-sm" onclick="loadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:4px;" title="顯示在地圖">👁️</button>
                    <button class="btn-sm" onclick="downloadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; border-radius:4px;" title="下載">💾</button>
                    \${canEdit ? \`<button class="btn-sm" onclick="renameCloudRoute('\${r.key}', '\${escapeHtml(r.name || '').replace(/'/g, "\\\\'")}')" style="padding:2px 4px; font-size:12px; color:#d97706; border:1px solid #fcd34d; background:#fffbeb; border-radius:4px;" title="重新命名">✏️</button><button class="btn-sm" onclick="deleteCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:4px;" title="刪除">🗑️</button>\` : ''}
                </div>
            </div>\`;`;

if (js.includes(sRender)) {
    js = js.replace(sRender, rRender);
} else {
    console.log("Could not find sRender");
}

// Update saveRouteToCloud
const sSave = `                nodeCount: routeCoordinates.length,
                timestamp: Date.now(),
                uploaderId: window.currentUserUid || 'unknown'`;
const rSave = `                nodeCount: routeCoordinates.length,
                timestamp: Date.now(),
                uploaderId: localStorage.getItem('pikmin_custom_name') || 'unknown'`;
if (js.includes(sSave)) {
    js = js.replace(sSave, rSave);
}

fs.writeFileSync('js/main.js', js);
console.log("js/main.js patched");

// Bump version
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2315"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092315');
fs.writeFileSync('index.html', html);
console.log("index.html bumped");

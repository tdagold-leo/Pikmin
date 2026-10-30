const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

// Update renderCloudRoutes layout
const sRender = `            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:4px 6px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${escapeHtml(titleFull)}">\${escapeHtml(r.name || '未命名')}<span style="color:#64748b; font-weight:normal; font-size:11px; margin-left:2px;">\${countStr}</span></span>
                    <span style="font-size:9px; color:#94a3b8;">\${dateStr}</span>
                </div>
                <div style="display:flex; gap:2px;">
                    <button class="btn-sm" onclick="loadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:4px;" title="顯示在地圖">👁️</button>
                    <button class="btn-sm" onclick="downloadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; border-radius:4px;" title="下載">💾</button>
                    \${canEdit ? \`<button class="btn-sm" onclick="renameCloudRoute('\${r.key}', '\${escapeHtml(r.name || '').replace(/'/g, "\\\\'")}')" style="padding:2px 4px; font-size:12px; color:#d97706; border:1px solid #fcd34d; background:#fffbeb; border-radius:4px;" title="重新命名">✏️</button><button class="btn-sm" onclick="deleteCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:4px;" title="刪除">🗑️</button>\` : ''}
                </div>
            </div>`;

const rRender = `            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px; margin-bottom:6px; display:flex; flex-direction:column; gap:6px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-size:13px; font-weight:bold; color:#0f172a; line-height:1.4; word-break:break-word;">
                    \${escapeHtml(r.name || '未命名')}
                    <span style="color:#64748b; font-weight:normal; font-size:11px; margin-left:4px;">\${countStr}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:10px; color:#94a3b8;">\${dateStr}</span>
                    <div style="display:flex; gap:4px;">
                        <button class="btn-sm" onclick="loadCloudRoute('\${r.key}')" style="padding:4px 6px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:6px; transition:all 0.2s;" title="顯示在地圖">👁️</button>
                        <button class="btn-sm" onclick="downloadCloudRoute('\${r.key}')" style="padding:4px 6px; font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; border-radius:6px; transition:all 0.2s;" title="下載">💾</button>
                        \${canEdit ? \`<button class="btn-sm" onclick="renameCloudRoute('\${r.key}', '\${escapeHtml(r.name || '').replace(/'/g, "\\\\'")}')" style="padding:4px 6px; font-size:12px; color:#d97706; border:1px solid #fcd34d; background:#fffbeb; border-radius:6px; transition:all 0.2s;" title="重新命名">✏️</button><button class="btn-sm" onclick="deleteCloudRoute('\${r.key}')" style="padding:4px 6px; font-size:12px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:6px; transition:all 0.2s;" title="刪除">🗑️</button>\` : ''}
                    </div>
                </div>
            </div>`;

if (js.includes(sRender)) {
    js = js.replace(sRender, rRender);
} else {
    console.log("Could not find sRender");
}

fs.writeFileSync('js/main.js', js);
console.log("js/main.js patched");

// Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Update width of the panel from 240px to 280px
html = html.replace('width:240px;', 'width:280px;');

// Update max-height of cloud list from 160px or 200px to 260px
html = html.replace('max-height:200px;', 'max-height:260px;');

html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2320"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092320');
fs.writeFileSync('index.html', html);
console.log("index.html bumped");

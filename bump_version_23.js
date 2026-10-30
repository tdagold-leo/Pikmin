const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old route-panel
let p1 = html.indexOf('<div id="route-panel"');
if (p1 !== -1) {
    let nest = 0;
    let p2 = -1;
    for (let i = p1; i < html.length; i++) {
        if (html.slice(i, i + 4) === '<div') nest++;
        else if (html.slice(i, i + 5) === '</div') {
            nest--;
            if (nest === 0) {
                p2 = i + 6;
                break;
            }
        }
    }
    if (p2 !== -1) {
        html = html.slice(0, p1) + html.slice(p2);
    }
}

// 2. The new route-panel HTML
const newRoutePanel = `<div id="route-panel" style="display:none; position:absolute; top:42px; left:0; z-index:20; background:rgba(255,255,255,0.98); padding:12px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.25); width:280px; max-width:90vw; border:1px solid #e2e8f0; transition:left 0.2s, right 0.2s;">
    <div style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#334155;">🗺️ 路徑管理</div>
    
    <div style="display:flex; gap:6px; margin-bottom:6px;">
        <input type="file" id="route-upload-file" accept=".gpx,.kml,.json,.txt,.csv" style="display:none;" onchange="handleRouteUpload(event)">
        <button class="btn-sm btn-default" onclick="document.getElementById('route-upload-file').click()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; font-weight:600;" title="上傳本機路徑">📂 上傳</button>
        <select id="route-export-format" style="border:1px solid #cbd5e1; border-radius:6px; font-size:12px; padding:0 2px; outline:none; cursor:pointer;" title="格式">
            <option value="gpx">GPX</option>
            <option value="kml">KML</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="txt">TXT</option>
        </select>
        <button class="btn-sm btn-primary" onclick="downloadCurrentRoute()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; background:#0ea5e9; border-color:#0284c7; color:#fff; font-weight:600;" title="下載目前畫面路徑">💾 下載</button>
    </div>

    <div style="display:flex; gap:6px; margin-bottom:6px;">
        <button id="route-draw-btn" class="btn-sm btn-default" onclick="toggleRouteDrawMode()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; border:1px solid #94a3b8; background:#f8fafc; color:#334155; font-weight:bold; transition:all 0.2s;">🖍️ 開始建立路線</button>
        <button class="btn-sm btn-default" onclick="clearCurrentRoute()" style="padding:6px; font-size:11px; border-radius:6px; color:#ef4444; border-color:#fca5a5; background:#fef2f2;" title="清除畫面上路徑">🗑️ 清除</button>
    </div>

    <div style="border-top:1px solid #cbd5e1; margin:8px 0;"></div>

    <div style="background:#f8fafc; padding:8px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:8px;">
        <div style="font-size:12px; font-weight:bold; color:#0f172a; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
            <span id="current-route-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">目前路線：未命名</span>
            <span id="current-route-status" style="font-size:10px; color:#64748b; font-weight:normal; white-space:nowrap; margin-left:4px;">無節點</span>
        </div>
        
        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
            <button class="btn-sm btn-primary" onclick="saveRouteToCloud()" style="flex:1; padding:4px 6px; font-size:11px; border-radius:4px; background:#f59e0b; border-color:#d97706; color:#fff; font-weight:bold; min-width:80px;">☁️ 分享至雲端</button>
            <button id="btn-cloud-rename" class="btn-sm" onclick="renameCurrentCloudRoute()" style="display:none; padding:4px 6px; font-size:11px; color:#d97706; border:1px solid #fcd34d; background:#fffbeb; border-radius:4px;">✏️ 改名</button>
            <button id="btn-cloud-delete" class="btn-sm" onclick="deleteCurrentCloudRoute()" style="display:none; padding:4px 6px; font-size:11px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:4px;">🗑️ 刪除</button>
        </div>
    </div>
    
    <div style="font-weight:bold; font-size:12px; color:#334155; margin-bottom:6px;">☁️ 雲端分享列表</div>
    <div id="cloud-route-list" style="display:flex; flex-direction:column; gap:4px; max-height:220px; overflow-y:auto; padding-right:2px;">
        <div style="font-size:11px; color:#94a3b8; text-align:center;">載入中...</div>
    </div>
</div>`;

// 3. Re-insert it into the map-route-btn container and restore position:relative
const marker = 'id="map-route-btn"';
let mIdx = html.indexOf(marker);
if (mIdx !== -1) {
    // Find its parent div
    let parentStart = html.lastIndexOf('<div', mIdx);
    // Find the end of parent's start tag
    let parentEnd = html.indexOf('>', parentStart);
    
    // ensure position:relative
    let parentTag = html.slice(parentStart, parentEnd + 1);
    if (!parentTag.includes('position:relative')) {
        let newParentTag = parentTag.replace('align-items:center;"', 'align-items:center; position:relative;"');
        html = html.slice(0, parentStart) + newParentTag + html.slice(parentEnd + 1);
        mIdx = html.indexOf(marker); // refresh
    }
    
    // Insert newRoutePanel after the button
    let btnEnd = html.indexOf('</button>', mIdx) + 9;
    html = html.slice(0, btnEnd) + '\n' + newRoutePanel + html.slice(btnEnd);
}

fs.writeFileSync('index.html', html);
console.log('index.html structure updated');


// 4. Update JS logic
let js = fs.readFileSync('js/main.js', 'utf8');

// Global currentCloudRoute
if (!js.includes('window.currentCloudRoute = null;')) {
    js = js.replace('var routeCoordinates = [];', 'var routeCoordinates = [];\n    window.currentCloudRoute = null;');
}

// Update handleRouteUpload
js = js.replace('window.handleRouteUpload = function(event) {', 'window.handleRouteUpload = function(event) {\n        window.currentCloudRoute = null;');

// Update toggleRoutePanel
const sToggle = `    window.toggleRoutePanel = function() {
        const panel = document.getElementById('route-panel');
        if (panel.style.display === 'none' || panel.style.display === '') {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    };`;
const rToggle = `    window.toggleRoutePanel = function() {
        const panel = document.getElementById('route-panel');
        if (panel.style.display === 'none' || panel.style.display === '') {
            panel.style.display = 'block';
            
            // Adjust bounds on mobile
            panel.style.left = '0';
            panel.style.right = 'auto';
            const rect = panel.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                panel.style.left = 'auto';
                panel.style.right = '0';
            }
        } else {
            panel.style.display = 'none';
        }
    };`;
if (js.includes(sToggle)) {
    js = js.replace(sToggle, rToggle);
} else {
    // try looser match
    let p = js.indexOf('window.toggleRoutePanel = function()');
    if (p !== -1) {
        let e = js.indexOf('};', p) + 2;
        js = js.slice(0, p) + rToggle + js.slice(e);
    }
}

// Update updateRouteStatus
const sUpdateStatus = `    function updateRouteStatus() {
        const st = document.getElementById('route-status');
        if (st) {
            if (routeCoordinates.length === 0) {
                st.innerText = window.isRouteDrawMode ? '請點擊地圖或現有標記連線' : '目前無路線';
            } else {
                st.innerText = \`已連接 \${routeCoordinates.length} 個節點\`;
            }
        }`;
const rUpdateStatus = `    function updateRouteStatus() {
        // UI updates
        const st = document.getElementById('current-route-status');
        if (st) {
            st.innerText = routeCoordinates.length === 0 ? (window.isRouteDrawMode ? '請點擊地圖連線' : '無節點') : \`\${routeCoordinates.length} 個節點\`;
        }
        const titleEl = document.getElementById('current-route-title');
        if (titleEl) {
            if (window.currentCloudRoute) {
                titleEl.innerText = '目前路線：' + (window.currentCloudRoute.name || '未命名');
            } else {
                titleEl.innerText = routeCoordinates.length > 0 ? '目前路線：本機/自訂' : '目前路線：未命名';
            }
        }
        
        const btnRename = document.getElementById('btn-cloud-rename');
        const btnDelete = document.getElementById('btn-cloud-delete');
        if (btnRename && btnDelete) {
            if (window.currentCloudRoute) {
                const myName = localStorage.getItem('pikmin_custom_name') || 'unknown';
                const r = window.currentCloudRoute;
                const canEdit = !r.uploaderId || r.uploaderId === 'unknown' || r.uploaderId === myName;
                if (canEdit) {
                    btnRename.style.display = 'inline-block';
                    btnDelete.style.display = 'inline-block';
                } else {
                    btnRename.style.display = 'none';
                    btnDelete.style.display = 'none';
                }
            } else {
                btnRename.style.display = 'none';
                btnDelete.style.display = 'none';
            }
        }`;
if (js.includes(sUpdateStatus)) {
    js = js.replace(sUpdateStatus, rUpdateStatus);
}

// Update clearCurrentRoute
const sClear = `    window.clearCurrentRoute = function() {
        if (routePolyline) {`;
const rClear = `    window.clearCurrentRoute = function() {
        window.currentCloudRoute = null;
        if (routePolyline) {`;
if (js.includes(sClear)) {
    js = js.replace(sClear, rClear);
}

// Update loadCloudRoute
const sLoad = `    window.loadCloudRoute = function(key) {
        const route = cloudRoutes.find(r => r.key === key);
        if (!route || !route.gpxData) return;`;
const rLoad = `    window.loadCloudRoute = function(key) {
        const route = cloudRoutes.find(r => r.key === key);
        if (!route || !route.gpxData) return;
        window.currentCloudRoute = route;`;
if (js.includes(sLoad)) {
    js = js.replace(sLoad, rLoad);
}

// Replace renderCloudRoutes
let rcrStart = js.indexOf('function renderCloudRoutes()');
if (rcrStart !== -1) {
    let rcrEnd = js.indexOf('window.exportRouteData = function');
    if (rcrEnd !== -1) {
        const newRender = `function renderCloudRoutes() {
        const container = document.getElementById('cloud-route-list');
        if (!container) return;
        
        if (cloudRoutes.length === 0) {
            container.innerHTML = '<div style="font-size:11px; color:#94a3b8; text-align:center;">目前雲端還沒有任何分享路線</div>';
            return;
        }
        
        cloudRoutes.sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        let html = '';
        cloudRoutes.forEach(r => {
            const dateStr = r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '';
            let count = r.nodeCount;
            if (!count && r.gpxData) {
                const match = r.gpxData.match(/<trkpt/g);
                count = match ? match.length : 0;
            }
            const countStr = count ? \` (\${count} 節點)\` : '';
            const titleFull = (r.name || '未命名') + countStr;
            
            html += \`
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:6px 8px; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="loadCloudRoute('\${r.key}')" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                <div style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${escapeHtml(titleFull)}">\${escapeHtml(r.name || '未命名')}<span style="color:#64748b; font-weight:normal; font-size:11px; margin-left:4px;">\${countStr}</span></span>
                    <span style="font-size:10px; color:#94a3b8;">\${dateStr}</span>
                </div>
                <div style="margin-left:8px;">
                    <button class="btn-sm" style="padding:4px 8px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:6px; pointer-events:none;">載入 ⬇️</button>
                </div>
            </div>\`;
        });
        container.innerHTML = html;
    }

    `;
        js = js.slice(0, rcrStart) + newRender + js.slice(rcrEnd);
    }
}

// Add renameCurrentCloudRoute & deleteCurrentCloudRoute
const newFns = `
    window.renameCurrentCloudRoute = function() {
        if (!window.currentCloudRoute) return;
        const key = window.currentCloudRoute.key;
        const currentName = window.currentCloudRoute.name;
        const newName = prompt('請輸入新的路線名稱：', currentName);
        if (newName !== null && newName.trim() !== '' && newName.trim() !== currentName) {
            dbRef('routes/' + key).update({ name: newName.trim() });
            window.currentCloudRoute.name = newName.trim();
            updateRouteStatus();
        }
    };

    window.deleteCurrentCloudRoute = function() {
        if (!window.currentCloudRoute) return;
        const key = window.currentCloudRoute.key;
        if (confirm('確定要刪除這條分享的路線嗎？')) {
            dbRef('routes/' + key).remove();
            clearCurrentRoute();
        }
    };
`;
js = js.replace('window.deleteCloudRoute = function(key) {', newFns + '\n    window.deleteCloudRoute = function(key) {');

// Bump version
js = js.replace(/v=\d{10,14}/g, 'v=202610092359');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2359"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092359');

fs.writeFileSync('js/main.js', js);
fs.writeFileSync('index.html', html);
console.log('JS patched');

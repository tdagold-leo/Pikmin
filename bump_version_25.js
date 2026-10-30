const fs = require('fs');

// 1. Patch HTML
let html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<div id="route-panel"');
if (sIdx !== -1) {
    let nest = 0;
    let eIdx = -1;
    for (let i = sIdx; i < html.length; i++) {
        if (html.slice(i, i + 4) === '<div') nest++;
        else if (html.slice(i, i + 5) === '</div') {
            nest--;
            if (nest === 0) {
                eIdx = i + 6;
                break;
            }
        }
    }
    
    if (eIdx !== -1) {
        const newRoutePanel = `<div id="route-panel" style="display:none; position:absolute; top:42px; left:0px; z-index:20; background:rgba(255,255,255,0.98); padding:12px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.25); width:280px; max-width:90vw; border:1px solid #e2e8f0; transition:left 0.2s, right 0.2s;">
    <div style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#334155;">🗺️ 路徑管理</div>
    
    <!-- Top Row: Upload & Create -->
    <div style="display:flex; gap:6px; margin-bottom:8px;">
        <input type="file" id="route-upload-file" accept=".gpx,.kml,.json,.txt,.csv" style="display:none;" onchange="handleRouteUpload(event)">
        <button class="btn-sm btn-default" onclick="document.getElementById('route-upload-file').click()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; font-weight:bold; color:#0f172a; border:1px solid #cbd5e1; background:#f8fafc;">📂 上傳檔案</button>
        <button id="btn-draw-new" class="btn-sm btn-default" onclick="startNewRoute()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; font-weight:bold; color:#0f172a; border:1px solid #cbd5e1; background:#f8fafc;">🖍️ 畫新路線</button>
    </div>

    <!-- Cloud List Select -->
    <div style="display:flex; gap:6px; margin-bottom:8px; align-items:center;">
        <select id="cloud-route-select" style="flex:1; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; padding:6px; outline:none; cursor:pointer; background:#fff; min-width:0;">
            <option value="">-- 選擇雲端路線 --</option>
        </select>
        <button class="btn-sm btn-primary" onclick="loadSelectedCloudRoute()" style="padding:6px 12px; font-size:12px; border-radius:6px; font-weight:bold; background:#0ea5e9; border-color:#0284c7; color:#fff; white-space:nowrap;">載入</button>
    </div>

    <div style="border-top:1px solid #cbd5e1; margin:10px 0;"></div>

    <!-- Active Route Info -->
    <div style="margin-bottom:8px;">
        <div style="font-size:12px; font-weight:bold; color:#0f172a; display:flex; justify-content:space-between; align-items:center;">
            <span style="white-space:nowrap;">目前路線：</span>
            <span id="current-route-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; margin-left:4px; color:#0369a1;">無</span>
            <span id="current-route-status" style="font-size:10px; color:#64748b; font-weight:normal; margin-left:8px; white-space:nowrap;">0 節點</span>
        </div>
    </div>

    <!-- Edit Area -->
    <div id="route-edit-area" style="background:#f8fafc; padding:8px; border-radius:8px; border:1px solid #e2e8f0;">
        <div style="font-size:11px; color:#64748b; font-weight:bold; margin-bottom:6px;">🛠️ 編輯區</div>
        
        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;">
            <button id="route-draw-btn" class="btn-sm btn-default" onclick="toggleRouteDrawMode()" style="flex:1; padding:4px 6px; font-size:11px; border-radius:4px; font-weight:bold; border:1px solid #94a3b8; color:#334155;">🖍️ 編輯 (點擊地圖連線)</button>
            <button class="btn-sm btn-default" onclick="clearCurrentRoute()" style="padding:4px 6px; font-size:11px; border-radius:4px; color:#ef4444; border-color:#fca5a5; background:#fef2f2;">❌ 清除</button>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;">
            <button id="btn-cloud-rename" class="btn-sm btn-default" onclick="renameCurrentCloudRoute()" style="flex:1; padding:4px 6px; font-size:11px; border-radius:4px; color:#d97706; border-color:#fcd34d; background:#fffbeb;" disabled>✏️ 改名</button>
            <button id="btn-cloud-delete" class="btn-sm btn-default" onclick="deleteCurrentCloudRoute()" style="flex:1; padding:4px 6px; font-size:11px; border-radius:4px; color:#ef4444; border-color:#fca5a5; background:#fef2f2;" disabled>🗑️ 刪除</button>
            <button id="btn-cloud-save" class="btn-sm btn-primary" onclick="updateRouteToCloud()" style="flex:1.5; padding:4px 6px; font-size:11px; border-radius:4px; background:#f59e0b; border-color:#d97706; color:#fff; font-weight:bold;" disabled>💾 儲存</button>
        </div>

        <div style="display:flex; gap:4px;">
            <select id="route-export-format" style="flex:1; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; padding:0 2px; outline:none; cursor:pointer; min-width:0;">
                <option value="gpx">GPX</option>
                <option value="kml">KML</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="txt">TXT</option>
            </select>
            <button id="btn-route-download" class="btn-sm btn-default" onclick="downloadCurrentRoute()" style="flex:2; padding:4px 6px; font-size:11px; border-radius:4px; font-weight:bold; border:1px solid #94a3b8;" disabled>⬇️ 下載格式</button>
        </div>
    </div>
</div>`;
        html = html.slice(0, sIdx) + newRoutePanel + html.slice(eIdx);
    }
}

html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.10.0030"');
html = html.replace(/v=\d{10,14}/g, 'v=202610100030');
fs.writeFileSync('index.html', html);
console.log('HTML patched');

// 2. Patch JS
let js = fs.readFileSync('js/main.js', 'utf8');

// Replace renderCloudRoutes
let rcrStart = js.indexOf('function renderCloudRoutes()');
if (rcrStart !== -1) {
    let rcrEnd = js.indexOf('window.exportRouteData = function', rcrStart);
    if (rcrEnd !== -1) {
        const newRender = `function renderCloudRoutes() {
        const select = document.getElementById('cloud-route-select');
        if (!select) return;
        
        if (cloudRoutes.length === 0) {
            select.innerHTML = '<option value="">-- 目前無雲端路線 --</option>';
            return;
        }
        
        cloudRoutes.sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        let html = '<option value="">-- 選擇雲端路線 --</option>';
        cloudRoutes.forEach(r => {
            let count = r.nodeCount;
            if (!count && r.gpxData) {
                const match = r.gpxData.match(/<trkpt/g);
                count = match ? match.length : 0;
            }
            const countStr = count ? \` (\${count} 節點)\` : '';
            const titleFull = (r.name || '未命名') + countStr;
            html += \`<option value="\${r.key}">\${escapeHtml(titleFull)}</option>\`;
        });
        select.innerHTML = html;
    }
    
    window.loadSelectedCloudRoute = function() {
        const select = document.getElementById('cloud-route-select');
        if (!select) return;
        const key = select.value;
        if (!key) {
            alert('請先在左側下拉選單選擇路線！');
            return;
        }
        loadCloudRoute(key);
    };
    
    window.startNewRoute = function() {
        clearCurrentRoute();
        window.isRouteDrawMode = true;
        const drawBtn = document.getElementById('route-draw-btn');
        if (drawBtn) {
            drawBtn.innerText = '🖍️ 結束編輯 (停止連線)';
            drawBtn.style.background = '#e0f2fe';
        }
        updateRouteStatus();
    };

    `;
        js = js.slice(0, rcrStart) + newRender + js.slice(rcrEnd);
    }
}

// Fix loadCloudRoute
const sLoad = `    window.loadCloudRoute = function(key) {
        const route = cloudRoutes.find(r => r.key === key);
        if (!route || !route.gpxData) return;
        window.currentCloudRoute = route;`;
const rLoad = `    window.loadCloudRoute = function(key) {
        const route = cloudRoutes.find(r => r.key === key);
        if (!route || !route.gpxData) return;
        clearCurrentRoute(); 
        window.currentCloudRoute = route;`;
if (js.includes(sLoad)) {
    js = js.replace(sLoad, rLoad);
}
// Remove the clearCurrentRoute that comes later in loadCloudRoute if it exists!
const badClear = `
        const trkpts = doc.querySelectorAll('trkpt');
        
        clearCurrentRoute();`;
if (js.includes(badClear)) {
    js = js.replace(badClear, `
        const trkpts = doc.querySelectorAll('trkpt');`);
}


// Fix updateRouteStatus
const sStatusStart = `    function updateRouteStatus() {`;
let pStatus = js.indexOf(sStatusStart);
if (pStatus !== -1) {
    let pStatusEnd = js.indexOf('function generateGpxData', pStatus);
    if (pStatusEnd !== -1) {
        const newStatus = `    function updateRouteStatus() {
        // UI updates
        const st = document.getElementById('current-route-status');
        if (st) {
            st.innerText = routeCoordinates.length === 0 ? (window.isRouteDrawMode ? '請點擊地圖連線' : '0 節點') : \`\${routeCoordinates.length} 節點\`;
        }
        const titleEl = document.getElementById('current-route-title');
        if (titleEl) {
            if (window.currentCloudRoute) {
                titleEl.innerText = window.currentCloudRoute.name || '未命名';
            } else {
                titleEl.innerText = routeCoordinates.length > 0 ? '本機/未儲存' : '無';
            }
        }
        
        const btnRename = document.getElementById('btn-cloud-rename');
        const btnDelete = document.getElementById('btn-cloud-delete');
        const btnSave = document.getElementById('btn-cloud-save');
        const btnDownload = document.getElementById('btn-route-download');
        
        if (btnRename && btnDelete && btnSave && btnDownload) {
            const hasRoute = routeCoordinates.length > 0;
            btnDownload.disabled = !hasRoute;
            
            let canEdit = false;
            if (window.currentCloudRoute) {
                const myName = localStorage.getItem('pikmin_custom_name') || 'unknown';
                const r = window.currentCloudRoute;
                canEdit = (!r.uploaderId || r.uploaderId === 'unknown' || r.uploaderId === myName);
            }
            
            if (window.currentCloudRoute) {
                if (canEdit) {
                    btnRename.disabled = false;
                    btnDelete.disabled = false;
                    btnSave.disabled = false;
                    btnSave.innerText = '💾 儲存 (更新)';
                    btnSave.onclick = updateRouteToCloud;
                } else {
                    btnRename.disabled = true;
                    btnDelete.disabled = true;
                    btnSave.disabled = false;
                    btnSave.innerText = '💾 另存至雲端';
                    btnSave.onclick = saveRouteToCloud;
                }
            } else {
                btnRename.disabled = true;
                btnDelete.disabled = true;
                if (hasRoute) {
                    btnSave.disabled = false;
                    btnSave.innerText = '💾 儲存 (上傳)';
                    btnSave.onclick = saveRouteToCloud;
                } else {
                    btnSave.disabled = true;
                    btnSave.innerText = '💾 儲存';
                }
            }
        }
        
        // draw mode button text
        const drawBtn = document.getElementById('route-draw-btn');
        if (drawBtn) {
            if (window.isRouteDrawMode) {
                drawBtn.innerText = '🖍️ 結束編輯 (停止連線)';
                drawBtn.style.background = '#e0f2fe';
            } else {
                drawBtn.innerText = '🖍️ 編輯 (點擊地圖連線)';
                drawBtn.style.background = '#f8fafc';
            }
        }
    }

    `;
        js = js.slice(0, pStatus) + newStatus + js.slice(pStatusEnd);
    }
}

// Fix handleRouteUpload
const pUpload = js.indexOf('window.handleRouteUpload = function');
if (pUpload !== -1) {
    const pUploadEnd = js.indexOf('};', pUpload) + 2;
    const newUpload = `window.handleRouteUpload = function(event) {
        clearCurrentRoute();
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const ext = file.name.split('.').pop().toLowerCase();
            let parsedCoords = [];
            
            if (ext === 'gpx' || ext === 'kml') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/xml');
                const pts = ext === 'gpx' ? doc.querySelectorAll('trkpt') : doc.querySelectorAll('Point');
                pts.forEach(pt => {
                    if (ext === 'gpx') {
                        const lat = parseFloat(pt.getAttribute('lat'));
                        const lon = parseFloat(pt.getAttribute('lon'));
                        if (!isNaN(lat) && !isNaN(lon)) parsedCoords.push({ lat, lng: lon });
                    } else {
                        const coordsStr = pt.querySelector('coordinates');
                        if (coordsStr) {
                            const [lon, lat] = coordsStr.textContent.trim().split(',');
                            if (lon && lat) parsedCoords.push({ lat: parseFloat(lat), lng: parseFloat(lon) });
                        }
                    }
                });
            } else if (ext === 'json') {
                try {
                    const arr = JSON.parse(content);
                    if (Array.isArray(arr)) {
                        arr.forEach(item => {
                            if (item.lat && item.lng) parsedCoords.push({ lat: parseFloat(item.lat), lng: parseFloat(item.lng) });
                        });
                    }
                } catch(e) {}
            } else if (ext === 'csv' || ext === 'txt') {
                const lines = content.split('\\n');
                lines.forEach(line => {
                    const match = line.match(/(-?\\d+\\.\\d+)[\\s,]+(-?\\d+\\.\\d+)/);
                    if (match) {
                        let v1 = parseFloat(match[1]);
                        let v2 = parseFloat(match[2]);
                        if (v1 > -90 && v1 < 90 && v2 > -180 && v2 < 180) {
                            parsedCoords.push({ lat: v1, lng: v2 });
                        } else if (v2 > -90 && v2 < 90 && v1 > -180 && v1 < 180) {
                            parsedCoords.push({ lat: v2, lng: v1 });
                        }
                    }
                });
            }
            
            if (parsedCoords.length > 0) {
                routeCoordinates = parsedCoords;
                
                // Prompt for name and immediately upload!
                const defaultName = file.name.replace(/\\.[^/.]+$/, "");
                const name = prompt('請為這條路線命名，以便立即上傳雲端：', defaultName);
                if (name !== null && name.trim() !== '') {
                    // Upload to Firebase
                    const gpxDataStr = window.generateGpxData ? window.generateGpxData() : ''; 
                    // Wait, we can manually generate minimal GPX if generateGpxData is not extracted:
                    let gpx = '<?xml version="1.0" encoding="UTF-8"?>\\n';
                    gpx += '<gpx version="1.1" creator="Pikmin Tracker">\\n';
                    gpx += \`  <trk>\\n    <name>\${escapeHtml(name.trim())}</name>\\n    <trkseg>\\n\`;
                    for (const pt of routeCoordinates) {
                        gpx += \`      <trkpt lat="\${pt.lat}" lon="\${pt.lng}"></trkpt>\\n\`;
                    }
                    gpx += '    </trkseg>\\n  </trk>\\n</gpx>';

                    if (routesRef && typeof routesRef.push === 'function') {
                        const newRef = routesRef.push({
                            name: name.trim(),
                            gpxData: gpx,
                            nodeCount: routeCoordinates.length,
                            timestamp: Date.now(),
                            uploaderId: localStorage.getItem('pikmin_custom_name') || 'unknown'
                        });
                        window.currentCloudRoute = {
                            key: newRef.key,
                            name: name.trim(),
                            uploaderId: localStorage.getItem('pikmin_custom_name') || 'unknown'
                        };
                        alert('檔案已成功上傳至雲端！');
                    }
                } else {
                    alert('未命名，檔案僅在本機顯示，尚未上傳至雲端。');
                }
                
                updateRouteStatus();
                // move map
                if (mapInstance && routeCoordinates[0]) {
                    mapInstance.setCenter(routeCoordinates[0]);
                }
            } else {
                alert('無法從檔案中讀取有效的座標資料');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };`;
    js = js.slice(0, pUpload) + newUpload + js.slice(pUploadEnd);
}

// Add a helper for escapeHtml in handleRouteUpload scope
js = js.replace(/function escapeHtml\(unsafe\) \{/, 'window.escapeHtml = function(unsafe) {');
js = js.replace(/return unsafe\n\s*\.replace/, 'if(!unsafe)return""; return String(unsafe).replace');


js = js.replace(/v=\d{10,14}/g, 'v=202610100030');
fs.writeFileSync('js/main.js', js);
console.log('JS patched');

const fs = require('fs');

// 1. Patch HTML
let html = fs.readFileSync('index.html', 'utf8');
const sSaveBtn = `<button class="btn-sm btn-primary" onclick="saveRouteToCloud()" style="flex:1; padding:4px 6px; font-size:11px; border-radius:4px; background:#f59e0b; border-color:#d97706; color:#fff; font-weight:bold; min-width:80px;">☁️ 分享至雲端</button>`;
const rSaveBtn = `<button id="btn-cloud-save" class="btn-sm btn-primary" onclick="saveRouteToCloud()" style="flex:1; padding:4px 6px; font-size:11px; border-radius:4px; background:#f59e0b; border-color:#d97706; color:#fff; font-weight:bold; min-width:80px;">☁️ 分享至雲端</button>`;
if (html.includes(sSaveBtn)) {
    html = html.replace(sSaveBtn, rSaveBtn);
}

html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.10.0015"');
html = html.replace(/v=\d{10,14}/g, 'v=202610100015');
fs.writeFileSync('index.html', html);
console.log('HTML patched');


// 2. Patch JS
let js = fs.readFileSync('js/main.js', 'utf8');

// Patch toggleRoutePanel
const sToggle = `    window.toggleRoutePanel = function() {
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
const rToggle = `    window.toggleRoutePanel = function() {
        const panel = document.getElementById('route-panel');
        if (panel.style.display === 'none' || panel.style.display === '') {
            panel.style.display = 'block';
            
            panel.style.left = '0px';
            
            setTimeout(() => {
                const rect = panel.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    const overflowRight = rect.right - window.innerWidth + 10;
                    panel.style.left = '-' + overflowRight + 'px';
                }
                
                const newRect = panel.getBoundingClientRect();
                if (newRect.left < 0) {
                    const overflowLeft = -newRect.left + 10;
                    panel.style.left = (parseFloat(panel.style.left) + overflowLeft) + 'px';
                }
            }, 0);
        } else {
            panel.style.display = 'none';
        }
    };`;
if (js.includes(sToggle)) {
    js = js.replace(sToggle, rToggle);
}

// Patch updateRouteStatus
const sStatus = `        const btnRename = document.getElementById('btn-cloud-rename');
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
const rStatus = `        const btnRename = document.getElementById('btn-cloud-rename');
        const btnDelete = document.getElementById('btn-cloud-delete');
        const btnSave = document.getElementById('btn-cloud-save');
        if (btnRename && btnDelete && btnSave) {
            let canEdit = false;
            if (window.currentCloudRoute) {
                const myName = localStorage.getItem('pikmin_custom_name') || 'unknown';
                const r = window.currentCloudRoute;
                canEdit = (!r.uploaderId || r.uploaderId === 'unknown' || r.uploaderId === myName);
            }
            
            if (window.currentCloudRoute && canEdit) {
                btnRename.style.display = '';
                btnDelete.style.display = '';
                btnSave.innerText = '☁️ 儲存覆蓋';
                btnSave.onclick = updateRouteToCloud;
            } else {
                btnRename.style.display = 'none';
                btnDelete.style.display = 'none';
                btnSave.innerText = '☁️ 分享至雲端';
                btnSave.onclick = saveRouteToCloud;
            }
        }`;
if (js.includes(sStatus)) {
    js = js.replace(sStatus, rStatus);
}

// Patch saveRouteToCloud
const sSave = `            routesRef.push({
                name: name.trim(),
                gpxData: gpx,
                nodeCount: routeCoordinates.length,
                timestamp: Date.now(),
                uploaderId: localStorage.getItem('pikmin_custom_name') || 'unknown'
            });
            alert('路線已成功分享至雲端！');`;
const rSave = `            const newRef = routesRef.push({
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
            updateRouteStatus();
            alert('路線已成功分享至雲端！');`;
if (js.includes(sSave)) {
    js = js.replace(sSave, rSave);
}

// Add updateRouteToCloud
const updateFn = `
    window.updateRouteToCloud = function() {
        if (routeCoordinates.length === 0) return alert('目前畫面沒有路線！');
        if (!window.currentCloudRoute) return;
        const key = window.currentCloudRoute.key;
        
        let gpx = '<?xml version="1.0" encoding="UTF-8"?>\\n';
        gpx += '<gpx version="1.1" creator="Pikmin Tracker">\\n';
        gpx += \`  <trk>\\n    <name>\${escapeHtml(window.currentCloudRoute.name)}</name>\\n    <trkseg>\\n\`;
        for (const pt of routeCoordinates) {
            gpx += \`      <trkpt lat="\${pt.lat}" lon="\${pt.lng}">\\n\`;
            if (pt.name) gpx += \`        <name>\${escapeHtml(pt.name)}</name>\\n\`;
            gpx += \`      </trkpt>\\n\`;
        }
        gpx += '    </trkseg>\\n  </trk>\\n</gpx>';
        
        dbRef('routes/' + key).update({
            gpxData: gpx,
            nodeCount: routeCoordinates.length,
            timestamp: Date.now()
        });
        alert('雲端路線已成功更新覆蓋！');
    };
`;
js = js.replace('window.saveRouteToCloud = function() {', updateFn + '\n    window.saveRouteToCloud = function() {');

js = js.replace(/v=\d{10,14}/g, 'v=202610100015');
fs.writeFileSync('js/main.js', js);
console.log('JS patched');

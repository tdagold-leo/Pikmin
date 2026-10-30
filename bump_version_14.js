const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Replace downloadCurrentRoute, downloadCloudRoute, and renderCloudRoutes
const sCloudRouteRender = `    function renderCloudRoutes() {`;
const rCloudRouteRender = `    function renderCloudRoutes() {
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
            html += \`
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:4px 6px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${escapeHtml(r.name || '未命名')}">\${escapeHtml(r.name || '未命名')}</span>
                    <span style="font-size:9px; color:#94a3b8;">\${dateStr}</span>
                </div>
                <div style="display:flex; gap:2px;">
                    <button class="btn-sm" onclick="loadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; border-radius:4px;" title="顯示在地圖">👁️</button>
                    <button class="btn-sm" onclick="downloadCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; border-radius:4px;" title="下載">💾</button>
                    \${r.uploaderId === window.currentUserUid ? \`<button class="btn-sm" onclick="deleteCloudRoute('\${r.key}')" style="padding:2px 4px; font-size:12px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2; border-radius:4px;" title="刪除">🗑️</button>\` : ''}
                </div>
            </div>\`;
        });
        container.innerHTML = html;
    }

    window.exportRouteData = function(coords, format, filename) {
        if (!coords || coords.length === 0) return alert('沒有可下載的路徑點！');
        let data = '';
        let mime = 'text/plain';
        
        if (format === 'gpx') {
            data = '<?xml version="1.0" encoding="UTF-8"?>\\n<gpx version="1.1" creator="Pikmin Tracker">\\n  <trk>\\n    <name>' + escapeHtml(filename) + '</name>\\n    <trkseg>\\n';
            for (const pt of coords) {
                data += \`      <trkpt lat="\${pt.lat}" lon="\${pt.lng}">\\n\`;
                if (pt.name) data += \`        <name>\${escapeHtml(pt.name)}</name>\\n\`;
                data += \`      </trkpt>\\n\`;
            }
            data += '    </trkseg>\\n  </trk>\\n</gpx>';
            mime = 'application/gpx+xml';
        } else if (format === 'kml') {
            data = '<?xml version="1.0" encoding="UTF-8"?>\\n<kml xmlns="http://www.opengis.net/kml/2.2">\\n  <Document>\\n    <name>' + escapeHtml(filename) + '</name>\\n    <Placemark>\\n      <name>Route</name>\\n      <LineString>\\n        <coordinates>\\n';
            for (const pt of coords) {
                data += \`\${pt.lng},\${pt.lat},0 \`;
            }
            data += '\\n        </coordinates>\\n      </LineString>\\n    </Placemark>\\n  </Document>\\n</kml>';
            mime = 'application/vnd.google-earth.kml+xml';
        } else if (format === 'json') {
            data = JSON.stringify(coords, null, 2);
            mime = 'application/json';
        } else if (format === 'csv') {
            data = 'lat,lng,name\\n';
            for (const pt of coords) {
                data += \`\${pt.lat},\${pt.lng},\${pt.name || ''}\\n\`;
            }
            mime = 'text/csv';
        }
        
        const blob = new Blob([data], {type: mime});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.' + format;
        a.click();
        URL.revokeObjectURL(url);
    };`;

// We have to extract the old block of `function renderCloudRoutes() { ... }` up to `window.saveRouteToCloud`
let idx1 = js.indexOf('    function renderCloudRoutes() {');
let idx2 = js.indexOf('    window.saveRouteToCloud = function() {');
if (idx1 !== -1 && idx2 !== -1) {
    js = js.slice(0, idx1) + rCloudRouteRender + '\n\n' + js.slice(idx2);
}

const sDownload1 = `    window.downloadCurrentRoute = function() {
        if (routeCoordinates.length === 0) return alert('沒有可下載的路徑點！請先上傳或在地圖上點擊建立。');
        let gpx = '<?xml version="1.0" encoding="UTF-8"?>\\n';
        gpx += '<gpx version="1.1" creator="Pikmin Tracker">\\n';
        gpx += '  <trk>\\n    <name>匯出路線</name>\\n    <trkseg>\\n';
        for (const pt of routeCoordinates) {
            gpx += \`      <trkpt lat="\${pt.lat}" lon="\${pt.lng}">\\n\`;
            if (pt.name) gpx += \`        <name>\${escapeHtml(pt.name)}</name>\\n\`;
            gpx += \`      </trkpt>\\n\`;
        }
        gpx += '    </trkseg>\\n  </trk>\\n</gpx>';
        
        const blob = new Blob([gpx], {type: 'application/gpx+xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'route.gpx';
        a.click();
        URL.revokeObjectURL(url);
    };`;
const rDownload1 = `    window.downloadCurrentRoute = function() {
        if (routeCoordinates.length === 0) return alert('沒有可下載的路徑點！請先上傳或在地圖上點擊建立。');
        const format = document.getElementById('route-export-format') ? document.getElementById('route-export-format').value : 'gpx';
        exportRouteData(routeCoordinates, format, 'export_route');
    };`;

if (js.includes(sDownload1)) {
    js = js.replace(sDownload1, rDownload1);
}

const sDownload2 = `    window.downloadCloudRoute = function(key) {
        const route = cloudRoutes.find(r => r.key === key);
        if (!route || !route.gpxData) return;
        
        const blob = new Blob([route.gpxData], {type: 'application/gpx+xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`\${route.name || 'route'}.gpx\`;
        a.click();
        URL.revokeObjectURL(url);
    };`;
const rDownload2 = `    window.downloadCloudRoute = function(key) {
        const route = cloudRoutes.find(r => r.key === key);
        if (!route || !route.gpxData) return;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(route.gpxData, 'text/xml');
        let coords = [];
        const trkpts = doc.querySelectorAll('trkpt, rtept, wpt');
        trkpts.forEach(pt => {
            const lat = parseFloat(pt.getAttribute('lat'));
            const lng = parseFloat(pt.getAttribute('lon'));
            if (!isNaN(lat) && !isNaN(lng)) {
                let name = '節點';
                const nameNode = pt.querySelector('name');
                if (nameNode) name = nameNode.textContent;
                coords.push({lat, lng, name});
            }
        });
        
        const format = document.getElementById('route-export-format') ? document.getElementById('route-export-format').value : 'gpx';
        exportRouteData(coords, format, route.name || 'route');
    };`;

if (js.includes(sDownload2)) {
    js = js.replace(sDownload2, rDownload2);
}

fs.writeFileSync('js/main.js', js);
console.log('js/main.js patched');

// 2. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const sButtons = `<input type="file" id="route-upload-file" accept=".gpx,.kml,.json,.txt,.csv" style="display:none;" onchange="handleRouteUpload(event)">
                            <button class="btn-sm btn-default" onclick="document.getElementById('route-upload-file').click()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; font-weight:600;">📂 上傳路徑</button>
                            <button class="btn-sm btn-primary" onclick="downloadCurrentRoute()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; background:#0ea5e9; border-color:#0284c7; color:#fff; font-weight:600;">💾 下載分享</button>
                        </div>`;
const rButtons = `<input type="file" id="route-upload-file" accept=".gpx,.kml,.json,.txt,.csv" style="display:none;" onchange="handleRouteUpload(event)">
                            <button class="btn-sm btn-default" onclick="document.getElementById('route-upload-file').click()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; font-weight:600;" title="上傳">📂 上傳</button>
                            <select id="route-export-format" style="border:1px solid #cbd5e1; border-radius:6px; font-size:12px; padding:0 2px; outline:none; cursor:pointer;" title="格式">
                                <option value="gpx">GPX</option>
                                <option value="kml">KML</option>
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                            </select>
                            <button class="btn-sm btn-primary" onclick="downloadCurrentRoute()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; background:#0ea5e9; border-color:#0284c7; color:#fff; font-weight:600;" title="下載">💾 下載</button>
                        </div>`;

if (html.includes(sButtons)) {
    html = html.replace(sButtons, rButtons);
}

// Adjust max-height if needed. We have it at 160px.
// If they say the layout is too long, the new 1-line item fixes it. Let's make it max-height:200px so it fits ~6 routes in view.
html = html.replace('max-height:160px;', 'max-height:200px;');

html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2245"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092245');

fs.writeFileSync('index.html', html);
console.log('index.html patched');

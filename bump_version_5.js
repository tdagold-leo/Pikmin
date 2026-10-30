const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const sVar = `    var mapInstance = null;`;
const rVar = `    var mapInstance = null;
    var routePolyline = null;
    var routeCoordinates = [];
    window.isRouteDrawMode = false;`;

if (js.includes(sVar) && !js.includes('routePolyline = null;')) {
    js = js.replace(sVar, rVar);
}

const sRouteMethods = `    window.goToMapCoords = function(coordsStr) {`;
const rRouteMethods = `    window.toggleRoutePanel = function() {
        const p = document.getElementById('route-panel');
        if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
    };

    window.toggleRouteDrawMode = function() {
        window.isRouteDrawMode = !window.isRouteDrawMode;
        const btn = document.getElementById('route-draw-btn');
        if (window.isRouteDrawMode) {
            btn.style.background = '#ecfdf5';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#047857';
            btn.innerHTML = '✅ 點選地圖或標記加入節點...';
            updateRouteStatus();
        } else {
            btn.style.background = '#f8fafc';
            btn.style.borderColor = '#94a3b8';
            btn.style.color = '#334155';
            btn.innerHTML = '🖍️ 開始在地圖上點擊連線';
        }
    };

    window.clearCurrentRoute = function() {
        if (routePolyline) {
            routePolyline.setMap(null);
            routePolyline = null;
        }
        routeCoordinates = [];
        updateRouteStatus();
    };

    window.addPointToRoute = function(pt) {
        routeCoordinates.push(pt);
        updateRouteStatus();
    };

    function updateRouteStatus() {
        const st = document.getElementById('route-status');
        if (st) {
            if (routeCoordinates.length === 0) {
                st.innerText = window.isRouteDrawMode ? '請點擊地圖或現有標記連線' : '目前無路線';
            } else {
                st.innerText = \`已連接 \${routeCoordinates.length} 個節點\`;
            }
        }
        
        if (routePolyline) {
            routePolyline.setMap(null);
        }
        
        if (routeCoordinates.length > 1 && mapInstance) {
            routePolyline = new google.maps.Polyline({
                path: routeCoordinates,
                geodesic: true,
                strokeColor: '#ec4899',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                map: mapInstance
            });
        }
    }

    window.downloadCurrentRoute = function() {
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
    };

    window.handleRouteUpload = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            
            // Try extracting GPX trkpt/wpt/rtept
            let coords = [];
            
            if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
                try {
                    let j = JSON.parse(text);
                    if (!Array.isArray(j)) j = [j];
                    j.forEach(item => {
                        if (item.lat && item.lng) coords.push({lat: Number(item.lat), lng: Number(item.lng), name: item.name || '節點'});
                    });
                } catch(e) {}
            } else {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/xml');
                const trkpts = doc.querySelectorAll('trkpt, rtept, wpt');
                if (trkpts.length > 0) {
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
                } else {
                    // Try KML coordinates
                    const coordsTags = doc.querySelectorAll('coordinates');
                    coordsTags.forEach(tag => {
                        const parts = tag.textContent.trim().split(/\\s+/);
                        parts.forEach(p => {
                            const [lng, lat] = p.split(',').map(Number);
                            if (!isNaN(lat) && !isNaN(lng)) {
                                coords.push({lat, lng, name: '節點'});
                            }
                        });
                    });
                }
            }
            
            if (coords.length === 0) {
                return alert('無法在檔案中找到路徑點 (支援 GPX/KML/JSON 格式)');
            }
            
            window.clearCurrentRoute();
            routeCoordinates = coords;
            
            updateRouteStatus();
            if (mapInstance && typeof google !== 'undefined') {
                const bounds = new google.maps.LatLngBounds();
                coords.forEach(c => bounds.extend(c));
                mapInstance.fitBounds(bounds);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; 
    };

    window.goToMapCoords = function(coordsStr) {`;

if (js.includes(sRouteMethods) && !js.includes('window.downloadCurrentRoute')) {
    js = js.replace(sRouteMethods, rRouteMethods);
}

const sInitMap = `        mapInstance = new Map(document.getElementById("google-map"), {
            center: { lat: 23.6978, lng: 120.9605 }, // Taiwan center
            zoom: 7,
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: true,
            zoomControl: true,
        });`;
const rInitMap = `        mapInstance = new Map(document.getElementById("google-map"), {
            center: { lat: 23.6978, lng: 120.9605 }, // Taiwan center
            zoom: 7,
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: true,
            zoomControl: true,
        });
        
        mapInstance.addListener('click', (e) => {
            if (window.isRouteDrawMode && e.latLng) {
                window.addPointToRoute({ lat: e.latLng.lat(), lng: e.latLng.lng(), name: '自訂點' });
            }
        });`;
if (js.includes(sInitMap) && !js.includes('window.isRouteDrawMode && e.latLng')) {
    js = js.replace(sInitMap, rInitMap);
}

const sLandmarkMarker = `                marker.addListener('click', () => {
                    const location = [lm.country, lm.city, lm.district].filter(Boolean).join(' ． ');`;
const rLandmarkMarker = `                marker.addListener('click', () => {
                    if (window.isRouteDrawMode) {
                        window.addPointToRoute({ lat, lng, name: lm.note || lm.type || '節點' });
                        return;
                    }
                    const location = [lm.country, lm.city, lm.district].filter(Boolean).join(' ． ');`;
if (js.includes(sLandmarkMarker) && !js.includes('window.isRouteDrawMode')) {
    js = js.replace(sLandmarkMarker, rLandmarkMarker);
}

fs.writeFileSync('js/main.js', js);
console.log('main.js fully patched');


let html = fs.readFileSync('index.html', 'utf8');

const sLayerHtml = `                <button id="map-layer-landmark" onclick="toggleMapLayer('landmark')" class="map-layer-btn active" title="顯示純點">📍</button>
            </div>
            <!-- 分類篩選 -->`;

const rLayerHtml = `                <button id="map-layer-landmark" onclick="toggleMapLayer('landmark')" class="map-layer-btn active" title="顯示純點">📍</button>
            </div>
            
            <!-- 路線管理按鈕 -->
            <div style="background:rgba(255,255,255,0.96); padding:5px 8px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.18); display:flex; gap:5px; align-items:center; position:relative;">
                <button id="map-route-btn" onclick="toggleRoutePanel()" class="map-layer-btn" title="路線工具" style="background:#f1f5f9;">🗺️</button>
                <div id="route-panel" style="display:none; position:absolute; top:42px; left:0; z-index:20; background:rgba(255,255,255,0.98); padding:12px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.25); width:240px; border:1px solid #e2e8f0;">
                    <div style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#334155;">🗺️ 路徑管理 (GPX/KML)</div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; gap:6px;">
                            <input type="file" id="route-upload-file" accept=".gpx,.kml,.json" style="display:none;" onchange="handleRouteUpload(event)">
                            <button class="btn-sm btn-default" onclick="document.getElementById('route-upload-file').click()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; font-weight:600;">📂 上傳路徑</button>
                            <button class="btn-sm btn-primary" onclick="downloadCurrentRoute()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; background:#0ea5e9; border-color:#0284c7; color:#fff; font-weight:600;">💾 下載分享</button>
                        </div>
                        <div style="border-top:1px solid #cbd5e1; margin:4px 0;"></div>
                        <div style="display:flex; gap:6px; align-items:center;">
                            <button id="route-draw-btn" class="btn-sm btn-default" onclick="toggleRouteDrawMode()" style="flex:1; padding:6px; font-size:12px; border-radius:6px; border:1px solid #94a3b8; background:#f8fafc; color:#334155; font-weight:bold; transition:all 0.2s;">🖍️ 開始建立路線</button>
                        </div>
                        <div style="display:flex; gap:6px; align-items:center;">
                            <button class="btn-sm btn-default" onclick="clearCurrentRoute()" style="flex:1; padding:4px; font-size:11px; border-radius:6px; color:#ef4444; border-color:#fca5a5; background:#fef2f2;">🗑️ 清除畫面上路徑</button>
                        </div>
                        <div id="route-status" style="font-size:11px; color:#64748b; text-align:center; margin-top:2px; font-weight:bold;">目前無路線</div>
                    </div>
                </div>
            </div>

            <!-- 分類篩選 -->`;

if (html.includes(sLayerHtml) && !html.includes('id="route-panel"')) {
    html = html.replace(sLayerHtml, rLayerHtml);
}

html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2230"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092230');

fs.writeFileSync('index.html', html);
console.log('index.html patched');

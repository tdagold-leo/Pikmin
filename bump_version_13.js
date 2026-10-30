const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Inject map click listener
const sInitMap = `        mapInfoWindow = new google.maps.InfoWindow();`;
const rInitMap = `        mapInfoWindow = new google.maps.InfoWindow();
        
        mapInstance.addListener('click', (e) => {
            if (window.isRouteDrawMode && e.latLng) {
                window.addPointToRoute({ lat: e.latLng.lat(), lng: e.latLng.lng(), name: '自訂點' });
            }
        });`;

if (js.includes(sInitMap) && !js.includes(`mapInstance.addListener('click'`)) {
    js = js.replace(sInitMap, rInitMap);
    console.log("Map click listener injected");
}

// 2. Add Cloud Route logic
const routeCloudLogic = `
    let cloudRoutes = [];
    
    // Subscribe to cloud routes
    const routesRef = dbRef('routes');
    if (routesRef && typeof routesRef.on === 'function') {
        routesRef.on('value', snap => {
            cloudRoutes = [];
            snap.forEach(child => {
                const data = child.val();
                if (data && typeof data === 'object') {
                    cloudRoutes.push({ key: child.key, ...data });
                }
            });
            renderCloudRoutes();
        });
    }

    function renderCloudRoutes() {
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
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:6px 8px; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${escapeHtml(r.name || '未命名')}</span>
                    <span style="font-size:10px; color:#94a3b8;">\${dateStr}</span>
                </div>
                <div style="display:flex; gap:4px;">
                    <button class="btn-sm btn-default" onclick="loadCloudRoute('\${r.key}')" style="flex:1; padding:4px; font-size:11px; border-radius:4px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669;">👀 顯示在地圖</button>
                    <button class="btn-sm btn-default" onclick="downloadCloudRoute('\${r.key}')" style="flex:1; padding:4px; font-size:11px; border-radius:4px; background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb;">💾 下載 (.gpx)</button>
                    \${r.uploaderId === window.currentUserUid ? \`<button class="btn-sm btn-default" onclick="deleteCloudRoute('\${r.key}')" style="padding:4px; font-size:11px; border-radius:4px; color:#ef4444; border:1px solid #fca5a5; background:#fef2f2;" title="刪除">🗑️</button>\` : ''}
                </div>
            </div>\`;
        });
        container.innerHTML = html;
    }

    window.saveRouteToCloud = function() {
        if (routeCoordinates.length === 0) return alert('目前畫面沒有路線！請先建立或上傳路線。');
        
        const name = prompt('請為這條路線命名以分享至雲端 (例如：台北車站種花路線)：');
        if (!name || name.trim() === '') return;
        
        let gpx = '<?xml version="1.0" encoding="UTF-8"?>\\n';
        gpx += '<gpx version="1.1" creator="Pikmin Tracker">\\n';
        gpx += \`  <trk>\\n    <name>\${escapeHtml(name.trim())}</name>\\n    <trkseg>\\n\`;
        for (const pt of routeCoordinates) {
            gpx += \`      <trkpt lat="\${pt.lat}" lon="\${pt.lng}">\\n\`;
            if (pt.name) gpx += \`        <name>\${escapeHtml(pt.name)}</name>\\n\`;
            gpx += \`      </trkpt>\\n\`;
        }
        gpx += '    </trkseg>\\n  </trk>\\n</gpx>';
        
        if (routesRef && typeof routesRef.push === 'function') {
            routesRef.push({
                name: name.trim(),
                gpxData: gpx,
                timestamp: Date.now(),
                uploaderId: window.currentUserUid || 'unknown'
            });
            alert('路線已成功分享至雲端！');
        }
    };

    window.loadCloudRoute = function(key) {
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
        
        if (coords.length > 0) {
            window.clearCurrentRoute();
            routeCoordinates = coords;
            updateRouteStatus();
            
            if (mapInstance && typeof google !== 'undefined') {
                const bounds = new google.maps.LatLngBounds();
                coords.forEach(c => bounds.extend(c));
                mapInstance.fitBounds(bounds);
            }
        }
    };

    window.downloadCloudRoute = function(key) {
        const route = cloudRoutes.find(r => r.key === key);
        if (!route || !route.gpxData) return;
        
        const blob = new Blob([route.gpxData], {type: 'application/gpx+xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`\${route.name || 'route'}.gpx\`;
        a.click();
        URL.revokeObjectURL(url);
    };

    window.deleteCloudRoute = function(key) {
        if (confirm('確定要刪除這條分享的路線嗎？')) {
            dbRef('routes/' + key).remove();
        }
    };
`;

if (!js.includes('function renderCloudRoutes()')) {
    const idx = js.indexOf('    function goToMapCoords(');
    if (idx !== -1) {
        js = js.slice(0, idx) + routeCloudLogic + js.slice(idx);
        console.log("Cloud route logic injected");
        fs.writeFileSync('js/main.js', js);
    }
}

const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const injection = `
    window.toggleRoutePanel = function() {
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
`;

if (!js.includes('window.downloadCurrentRoute = function')) {
    const idx = js.indexOf('    function goToMapCoords(');
    if (idx !== -1) {
        js = js.slice(0, idx) + injection + js.slice(idx);
        fs.writeFileSync('js/main.js', js);
        console.log("Functions injected!");
    } else {
        console.log("goToMapCoords not found!");
    }
} else {
    console.log("Already has window.downloadCurrentRoute = function");
}

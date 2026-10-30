const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Add routeMarkers variable
const sVar = `    var routePolyline = null;
    var routeCoordinates = [];`;
const rVar = `    var routePolyline = null;
    var routeCoordinates = [];
    var routeMarkers = [];`;
if (js.includes(sVar)) {
    js = js.replace(sVar, rVar);
}

// 2. Update clearCurrentRoute
const sClear = `    window.clearCurrentRoute = function() {
        if (routePolyline) {
            routePolyline.setMap(null);
            routePolyline = null;
        }
        routeCoordinates = [];
        updateRouteStatus();
    };`;
const rClear = `    window.clearCurrentRoute = function() {
        if (routePolyline) {
            routePolyline.setMap(null);
            routePolyline = null;
        }
        if (typeof routeMarkers !== 'undefined') {
            routeMarkers.forEach(m => m.map = null);
            routeMarkers = [];
        }
        routeCoordinates = [];
        updateRouteStatus();
    };`;
if (js.includes(sClear)) {
    js = js.replace(sClear, rClear);
}

// 3. Update updateRouteStatus
const sStatus = `    function updateRouteStatus() {
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
    }`;
const rStatus = `    function updateRouteStatus() {
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
        
        if (typeof routeMarkers !== 'undefined') {
            routeMarkers.forEach(m => m.map = null);
            routeMarkers = [];
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
        
        if (routeCoordinates.length > 0 && mapInstance && google && google.maps && google.maps.marker) {
            routeCoordinates.forEach((pt, index) => {
                const num = index + 1;
                const div = document.createElement('div');
                div.style.background = '#ec4899';
                div.style.color = '#fff';
                div.style.borderRadius = '50%';
                div.style.width = '20px';
                div.style.height = '20px';
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.justifyContent = 'center';
                div.style.fontSize = '11px';
                div.style.fontWeight = 'bold';
                div.style.border = '2px solid white';
                div.style.boxShadow = '0 1px 3px rgba(0,0,0,0.4)';
                div.style.cursor = 'default';
                div.innerText = num;
                
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: mapInstance,
                    position: { lat: pt.lat, lng: pt.lng },
                    content: div,
                    title: pt.name || '節點 ' + num
                });
                
                routeMarkers.push(marker);
            });
        }
    }`;

if (js.includes(sStatus)) {
    js = js.replace(sStatus, rStatus);
} else {
    console.log("Could not find updateRouteStatus to replace!");
}

fs.writeFileSync('js/main.js', js);
console.log('js/main.js patched');

// Also bump version
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2300"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092300');
fs.writeFileSync('index.html', html);
console.log('index.html bumped');

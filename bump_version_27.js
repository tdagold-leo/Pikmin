const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Fix window.clearCurrentRoute(); bug in loadCloudRoute
const bug1 = `        if (coords.length > 0) {
            window.clearCurrentRoute();
            routeCoordinates = coords;
            updateRouteStatus();`;
const fix1 = `        if (coords.length > 0) {
            // Do not call clearCurrentRoute here because it nullifies currentCloudRoute!
            if (routePolyline) routePolyline.setMap(null);
            if (typeof routeMarkers !== 'undefined') {
                routeMarkers.forEach(m => m.map = null);
                routeMarkers = [];
            }
            routeCoordinates = coords;
            updateRouteStatus();`;
if (js.includes(bug1)) {
    js = js.replace(bug1, fix1);
    console.log('Fixed loadCloudRoute bug');
}

// 2. Fix a.click() missing appendChild in exportRouteData
const bug2 = `        a.download = filename + '.' + format;
        a.click();
        URL.revokeObjectURL(url);`;
const fix2 = `        a.download = filename + '.' + format;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);`;
if (js.includes(bug2)) {
    js = js.replace(bug2, fix2);
    console.log('Fixed exportRouteData download bug');
}

// 3. Update downloadCurrentRoute to use real filename
const bug3 = `    window.downloadCurrentRoute = function() {
        if (routeCoordinates.length === 0) return alert('沒有可下載的路徑點！請先上傳或在地圖上點擊建立。');
        const format = document.getElementById('route-export-format') ? document.getElementById('route-export-format').value : 'gpx';
        exportRouteData(routeCoordinates, format, 'export_route');
    };`;
const fix3 = `    window.downloadCurrentRoute = function() {
        if (routeCoordinates.length === 0) return alert('沒有可下載的路徑點！請先上傳或在地圖上點擊建立。');
        const format = document.getElementById('route-export-format') ? document.getElementById('route-export-format').value : 'gpx';
        let filename = 'route';
        if (window.currentCloudRoute && window.currentCloudRoute.name) {
            filename = window.currentCloudRoute.name;
        } else if (routeCoordinates.length > 0 && routeCoordinates[0].name && routeCoordinates[0].name !== '節點') {
            filename = routeCoordinates[0].name;
        }
        exportRouteData(routeCoordinates, format, filename);
    };`;
if (js.includes(bug3)) {
    js = js.replace(bug3, fix3);
    console.log('Fixed downloadCurrentRoute filename');
}

// Bump version
js = js.replace(/v=\d{10,14}/g, 'v=202610100035');
fs.writeFileSync('js/main.js', js);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.10.0035"');
html = html.replace(/v=\d{10,14}/g, 'v=202610100035');
fs.writeFileSync('index.html', html);
console.log('Patched');

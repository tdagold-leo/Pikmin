const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Add route state variables at the top of the file or near map variables
const s1 = `let mapInstance = null;
let mapInfoWindow = null;
let isMapScriptLoading = false;
let isMapScriptLoaded = false;
let currentMapMarkers = [];`;

const r1 = `let mapInstance = null;
let mapInfoWindow = null;
let isMapScriptLoading = false;
let isMapScriptLoaded = false;
let currentMapMarkers = [];
let routePolyline = null;
let routeCoordinates = [];
window.isRouteDrawMode = false;`;

// 2. Add route logic functions
const s2 = `    window.goToMapCoords = function(coordsStr) {`;

const r2 = `    window.toggleRoutePanel = function() {
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
            btn.innerHTML = '✅ 點擊地圖加入節點';
            updateRouteStatus();
        } else {
            btn.style.background = '#f8fafc';
            btn.style.borderColor = '#cbd5e1';
            btn.style.color = '#334155';
            btn.innerHTML = '🖍️ 開始建立路線';
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
                st.innerText = window.isRouteDrawMode ? '請點擊地圖或標記連線' : '目前無路線';
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
        if (routeCoordinates.length === 0) return alert('沒有可下載的路徑');
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
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/xml');
            
            // Check for KML or GPX
            let coords = [];
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
                // Try KML coordinates tag
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
            
            if (coords.length === 0) {
                return alert('無法在檔案中找到路徑點 (支援 GPX/KML 格式)');
            }
            
            window.clearCurrentRoute();
            routeCoordinates = coords;
            
            const bounds = new google.maps.LatLngBounds();
            coords.forEach(c => bounds.extend(c));
            updateRouteStatus();
            if (mapInstance) {
                mapInstance.fitBounds(bounds);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; 
    };

    window.goToMapCoords = function(coordsStr) {`;

// 3. Add to initMap
const s3 = `        mapInstance = new Map(document.getElementById("google-map"), {
            center: { lat: 23.6978, lng: 120.9605 }, // Taiwan center
            zoom: 7,
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: true,
            zoomControl: true,
        });`;

const r3 = `        mapInstance = new Map(document.getElementById("google-map"), {
            center: { lat: 23.6978, lng: 120.9605 }, // Taiwan center
            zoom: 7,
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: true,
            zoomControl: true,
        });
        
        mapInstance.addListener('click', (e) => {
            if (window.isRouteDrawMode) {
                window.addPointToRoute({ lat: e.latLng.lat(), lng: e.latLng.lng(), name: '自訂節點' });
            }
        });`;


// 4. Hook marker clicks for Postcards/Landmarks/Mushrooms
// Marker 1: Postcards
const s4 = `                marker.addListener('click', () => {
                    const imgHtml = (pc.image && pc.image !== '無圖片') `;
const r4 = `                marker.addListener('click', () => {
                    if (window.isRouteDrawMode) {
                        window.addPointToRoute({ lat, lng, name: pc.name || '節點' });
                        return;
                    }
                    const imgHtml = (pc.image && pc.image !== '無圖片') `;

// Marker 2: Mushrooms
const s5 = `                marker.addListener('click', () => {
                    const isUnclaimed = !mush.user || mush.user === '';`;
const r5 = `                marker.addListener('click', () => {
                    if (window.isRouteDrawMode) {
                        window.addPointToRoute({ lat, lng, name: mush.name || '節點' });
                        return;
                    }
                    const isUnclaimed = !mush.user || mush.user === '';`;

// Marker 3: Landmarks
const s6 = `                marker.addListener('click', () => {
                    const location = [lm.country, lm.city, lm.district].filter(Boolean).join(' ． ');`;
const r6 = `                marker.addListener('click', () => {
                    if (window.isRouteDrawMode) {
                        window.addPointToRoute({ lat, lng, name: lm.note || lm.type || '節點' });
                        return;
                    }
                    const location = [lm.country, lm.city, lm.district].filter(Boolean).join(' ． ');`;

function flexibleReplace(text, search, replace) {
    const normalize = str => str.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
    const searchNorm = normalize(search);
    const textNorm = normalize(text);
    if (textNorm.includes(searchNorm)) {
        const regexStr = search.trim().split(/\s+/).map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+');
        return text.replace(new RegExp(regexStr), replace);
    }
    return text;
}

js = flexibleReplace(js, s1, r1);
js = flexibleReplace(js, s2, r2);
js = flexibleReplace(js, s3, r3);
js = flexibleReplace(js, s4, r4);
js = flexibleReplace(js, s5, r5);
js = flexibleReplace(js, s6, r6);

fs.writeFileSync('js/main.js', js);
console.log('main.js patched');

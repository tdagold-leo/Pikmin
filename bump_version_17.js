const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// Update renderCloudRoutes
const sRender = `        cloudRoutes.forEach(r => {
            const dateStr = r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '';
            html += \`
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:4px 6px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${escapeHtml(r.name || '未命名')}">\${escapeHtml(r.name || '未命名')}</span>
                    <span style="font-size:9px; color:#94a3b8;">\${dateStr}</span>
                </div>`;
                
const rRender = `        cloudRoutes.forEach(r => {
            const dateStr = r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '';
            let count = r.nodeCount;
            if (!count && r.gpxData) {
                const match = r.gpxData.match(/<trkpt/g);
                count = match ? match.length : 0;
            }
            const countStr = count ? \` (\${count} 節點)\` : '';
            const titleFull = (r.name || '未命名') + countStr;
            html += \`
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:4px 6px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                    <span style="font-size:12px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${escapeHtml(titleFull)}">\${escapeHtml(r.name || '未命名')}<span style="color:#64748b; font-weight:normal; font-size:11px; margin-left:2px;">\${countStr}</span></span>
                    <span style="font-size:9px; color:#94a3b8;">\${dateStr}</span>
                </div>`;

if (js.includes(sRender)) {
    js = js.replace(sRender, rRender);
} else {
    console.log("Could not find sRender");
}

// Update saveRouteToCloud
const sSave = `        if (routesRef && typeof routesRef.push === 'function') {
            routesRef.push({
                name: name.trim(),
                gpxData: gpx,
                timestamp: Date.now(),
                uploaderId: window.currentUserUid || 'unknown'
            });`;
const rSave = `        if (routesRef && typeof routesRef.push === 'function') {
            routesRef.push({
                name: name.trim(),
                gpxData: gpx,
                nodeCount: routeCoordinates.length,
                timestamp: Date.now(),
                uploaderId: window.currentUserUid || 'unknown'
            });`;

if (js.includes(sSave)) {
    js = js.replace(sSave, rSave);
} else {
    console.log("Could not find sSave");
}

fs.writeFileSync('js/main.js', js);
console.log("js/main.js patched");

// Bump version
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2305"');
html = html.replace(/v=\d{10,14}/g, 'v=202610092305');
fs.writeFileSync('index.html', html);
console.log("index.html bumped");

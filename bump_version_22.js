const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<div id="route-panel"');
let nest = 0;
let eIdx = -1;

for (let i = sIdx; i < html.length; i++) {
    if (html.slice(i, i + 4) === '<div') {
        nest++;
    } else if (html.slice(i, i + 5) === '</div') {
        nest--;
        if (nest === 0) {
            eIdx = i + 6; // Include closing '</div>'
            break;
        }
    }
}

if (eIdx !== -1) {
    let routePanelHtml = html.slice(sIdx, eIdx);
    
    // Remove it from its original place
    html = html.slice(0, sIdx) + html.slice(eIdx);
    
    // Modify styles of routePanelHtml
    routePanelHtml = routePanelHtml.replace(
        'style="display:none; position:absolute; top:42px; left:0; z-index:20; background:rgba(255,255,255,0.98); padding:12px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.25); width:280px; border:1px solid #e2e8f0;"',
        'style="display:none; flex-basis:100%; max-width:340px; margin-top:2px; z-index:20; background:rgba(255,255,255,0.98); padding:12px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.25); border:1px solid #e2e8f0;"'
    );
    
    // Remove position:relative from the parent of map-route-btn
    html = html.replace('align-items:center; position:relative;">\n                <button id="map-route-btn"', 'align-items:center;">\n                <button id="map-route-btn"');
    html = html.replace('align-items:center; position:relative;">\r\n                <button id="map-route-btn"', 'align-items:center;">\r\n                <button id="map-route-btn"');
    
    // Now insert it right before the flex container's closing </div>
    // Look for <div id="google-map"
    const insertPos = html.indexOf('<div id="google-map"');
    if (insertPos !== -1) {
        // Find the </div> just before google-map
        const preceding = html.slice(0, insertPos);
        const lastDivClose = preceding.lastIndexOf('</div>');
        if (lastDivClose !== -1) {
            html = preceding.slice(0, lastDivClose) + '\n            ' + routePanelHtml + '\n        ' + preceding.slice(lastDivClose) + html.slice(insertPos);
        }
    }
    
    // Bump version
    html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.09.2325"');
    html = html.replace(/v=\d{10,14}/g, 'v=202610092325');
    
    fs.writeFileSync('index.html', html);
    console.log("Patched successfully");
} else {
    console.log("Failed to find end of route-panel");
}

let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/v=\d{10,14}/g, 'v=202610092325');
fs.writeFileSync('js/main.js', js);

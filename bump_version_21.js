const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<div id="route-panel"');
const eIdxStr = '<!-- 分類篩選 -->';
const eIdx = html.indexOf(eIdxStr);

if (sIdx !== -1 && eIdx !== -1) {
    // 1. Extract the route-panel
    let beforeRoutePanel = html.slice(0, sIdx);
    
    // Find the end of route-panel by looking for the end of its parent div
    // The parent is: 
    // <div style="background:... align-items:center; position:relative;">
    //     <button ...>🗺️</button>
    //     <div id="route-panel" ...>...</div>
    // </div>
    // We want to just remove <div id="route-panel" ...> ... </div>
    // We can find the closing </div></div> before <!-- 分類篩選 -->
    const chunk = html.slice(sIdx, eIdx);
    // Find the last </div> before <!-- 分類篩選 -->, which closes the parent
    const lastDiv = chunk.lastIndexOf('</div>');
    
    let routePanelHtml = chunk.slice(0, lastDiv); // This might have extra spaces at the end, but that's fine.
    // Actually, we must be careful not to clip the parent's closing div too early.
    // It's safer to use a regex or string replacement.
}

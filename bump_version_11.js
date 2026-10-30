const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const sLayerHtml = `            <!-- 分類篩選 -->`;

const rLayerHtml = `            <!-- 路線管理按鈕 -->
            <div style="background:rgba(255,255,255,0.96); padding:5px 8px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.18); display:flex; gap:5px; align-items:center; position:relative;">
                <button id="map-route-btn" onclick="toggleRoutePanel()" class="map-layer-btn" title="路線工具" style="background:#f1f5f9;">🗺️</button>
                <div id="route-panel" style="display:none; position:absolute; top:42px; left:0; z-index:20; background:rgba(255,255,255,0.98); padding:12px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.25); width:240px; border:1px solid #e2e8f0;">
                    <div style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#334155;">🗺️ 路徑管理</div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; gap:6px;">
                            <input type="file" id="route-upload-file" accept=".gpx,.kml,.json,.txt,.csv" style="display:none;" onchange="handleRouteUpload(event)">
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
    fs.writeFileSync('index.html', html);
    console.log('UI injected successfully!');
} else {
    console.log('Failed to inject UI or already injected.');
}

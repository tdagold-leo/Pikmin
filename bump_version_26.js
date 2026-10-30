const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const sStatusStart = 'function updateRouteStatus() {';
const sStatusEndMarker = '        if (routePolyline) {';

let pStatus = js.indexOf(sStatusStart);
if (pStatus !== -1) {
    let pStatusEnd = js.indexOf(sStatusEndMarker, pStatus);
    if (pStatusEnd !== -1) {
        const newStatusUI = `function updateRouteStatus() {
        // UI updates
        const st = document.getElementById('current-route-status');
        if (st) {
            st.innerText = routeCoordinates.length === 0 ? (window.isRouteDrawMode ? '請點擊地圖連線' : '0 節點') : \`\${routeCoordinates.length} 節點\`;
        }
        const titleEl = document.getElementById('current-route-title');
        if (titleEl) {
            if (window.currentCloudRoute) {
                titleEl.innerText = window.currentCloudRoute.name || '未命名';
            } else {
                titleEl.innerText = routeCoordinates.length > 0 ? '本機/未儲存' : '無';
            }
        }
        
        const btnRename = document.getElementById('btn-cloud-rename');
        const btnDelete = document.getElementById('btn-cloud-delete');
        const btnSave = document.getElementById('btn-cloud-save');
        const btnDownload = document.getElementById('btn-route-download');
        
        if (btnRename && btnDelete && btnSave && btnDownload) {
            const hasRoute = routeCoordinates.length > 0;
            btnDownload.disabled = !hasRoute;
            
            let canEdit = false;
            if (window.currentCloudRoute) {
                const myName = localStorage.getItem('pikmin_custom_name') || 'unknown';
                const r = window.currentCloudRoute;
                canEdit = (!r.uploaderId || r.uploaderId === 'unknown' || r.uploaderId === myName);
            }
            
            if (window.currentCloudRoute) {
                if (canEdit) {
                    btnRename.disabled = false;
                    btnDelete.disabled = false;
                    btnSave.disabled = false;
                    btnSave.innerText = '☁️ 更新至雲端';
                    btnSave.onclick = updateRouteToCloud;
                } else {
                    btnRename.disabled = true;
                    btnDelete.disabled = true;
                    btnSave.disabled = false;
                    btnSave.innerText = '☁️ 另存新分享';
                    btnSave.onclick = saveRouteToCloud;
                }
            } else {
                btnRename.disabled = true;
                btnDelete.disabled = true;
                if (hasRoute) {
                    btnSave.disabled = false;
                    btnSave.innerText = '☁️ 分享至雲端';
                    btnSave.onclick = saveRouteToCloud;
                } else {
                    btnSave.disabled = true;
                    btnSave.innerText = '☁️ 分享至雲端';
                }
            }
        }
        
        // draw mode button text
        const drawBtn = document.getElementById('route-draw-btn');
        if (drawBtn) {
            if (window.isRouteDrawMode) {
                drawBtn.innerText = '🖍️ 結束編輯 (停止連線)';
                drawBtn.style.background = '#e0f2fe';
            } else {
                drawBtn.innerText = '🖍️ 編輯 (點擊地圖連線)';
                drawBtn.style.background = '#f8fafc';
            }
        }
        
`;
        js = js.slice(0, pStatus) + newStatusUI + js.slice(pStatusEnd);
        fs.writeFileSync('js/main.js', js);
        console.log('Fixed updateRouteStatus');
    }
}

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldFooter = `            <!-- 底部操作列：刪除與儲存 -->
            <div style="display:flex; gap:8px; margin-top:10px; align-items:center;">
                <button type="button" onclick="deleteItem(currentEditingTimeId, currentEditingType); closeModal('time-modal');" style="flex:0 0 auto; padding:12px 16px; font-size:16px; border-radius:12px; border:1px solid #fecdd3; background:#fff1f2; color:#e11d48; cursor:pointer; transition:all 0.2s;" title="刪除">🗑️</button>
                <button class="btn-block" style="flex:1; padding:12px; font-size:15px; font-weight:800; border-radius:12px; border:none; cursor:pointer; background:linear-gradient(135deg, #f59e0b, #d97706); color:white; box-shadow:0 4px 14px rgba(245,158,11,0.35); transition:all 0.2s;" id="time-modal-submit-btn">💾 儲存修改</button>
            </div>`;

const newFooter = `            <!-- 底部操作列：儲存與刪除 -->
            <div style="display:flex; gap:8px; margin-top:10px; align-items:center;">
                <button class="btn-block" style="flex:1; padding:12px; font-size:15px; font-weight:800; border-radius:12px; border:none; cursor:pointer; background:linear-gradient(135deg, #f59e0b, #d97706); color:white; box-shadow:0 4px 14px rgba(245,158,11,0.35); transition:all 0.2s;" id="time-modal-submit-btn">💾 儲存修改</button>
                <button type="button" onclick="deleteItem(currentEditingTimeId, currentEditingType); closeModal('time-modal');" style="flex:0 0 auto; padding:12px 16px; font-size:16px; border-radius:12px; border:1px solid #fecdd3; background:#fff1f2; color:#e11d48; cursor:pointer; transition:all 0.2s;" title="刪除">🗑️</button>
            </div>`;

html = html.replace(oldFooter, newFooter);

// bump version
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.09.23.0153"');
html = html.replace(/v=\d{10,14}/g, 'v=202609230153');

fs.writeFileSync('index.html', html);
console.log('done');

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

// For Add Modal
const idxAdd = lines.findIndex(l => l.includes('id="post-tag-container"'));
if (idxAdd !== -1) {
    // We need to replace lines from (idxAdd - 5) to (idxAdd + 5) maybe?
    // Let's just find the precise block start
    let startAdd = idxAdd;
    while(startAdd > 0 && !lines[startAdd].includes('<div style="display:flex; gap:6px;">')) startAdd--;
    let endAdd = idxAdd;
    while(endAdd < lines.length && !lines[endAdd].includes('id="post-auth"')) endAdd++;
    endAdd += 2; // include the </div> after post-auth
    
    lines.splice(startAdd, endAdd - startAdd + 1, ...`                <div class="input-group" style="margin:0;">
                    <label style="font-size:11px; margin-bottom:2px;">名稱</label>
                    <input type="text" id="post-name" class="input-base" placeholder="例如：櫻花美菇" style="padding:6px 10px; font-size:13px;">
                </div>
                <div style="display:flex; gap:6px;">
                    <div class="input-group" id="post-tag-container" style="flex:1; margin:0;">
                        <label style="font-size:11px; margin-bottom:2px;">標籤</label>
                        <input type="text" id="post-tag" class="input-base" placeholder="例如：2026櫻花季" style="padding:6px 10px; font-size:13px;">
                    </div>
                    <div class="input-group" id="post-sg-sub-container" style="flex:1; margin:0; display:none;">
                        <label style="font-size:11px; margin-bottom:2px; color:#854d0e; font-weight:700;">子分類 <span style="color:#9ca3af; font-size:10px; font-weight:normal;">(選填)</span></label>
                        <input type="text" id="post-sg-sub" class="input-base" style="border:1px solid #facc15; padding:6px 10px; font-size:13px;" placeholder="例如：第一期">
                    </div>
                    <div class="input-group" style="flex:1; margin:0;">
                        <label style="font-size:11px; margin-bottom:2px;">🔑 授權 <span style="color:#9ca3af; font-size:10px;">(選填)</span></label>
                        <input type="text" id="post-auth" class="input-base" placeholder="拍攝者 / 授權來源" style="padding:6px 10px; font-size:13px;">
                    </div>
                </div>`.split('\n'));
}

// For Edit Modal
const idxEdit = lines.findIndex(l => l.includes('id="edit-post-tag-container"'));
if (idxEdit !== -1) {
    let startEdit = idxEdit;
    while(startEdit > 0 && !lines[startEdit].includes('<div style="display:flex; gap:6px;">')) startEdit--;
    let endEdit = idxEdit;
    while(endEdit < lines.length && !lines[endEdit].includes('id="edit-post-auth"')) endEdit++;
    endEdit += 2; // include the </div>
    
    lines.splice(startEdit, endEdit - startEdit + 1, ...`                <div style="display:flex; gap:6px;">
                    <div class="input-group" id="edit-post-tag-container" style="flex:1; margin:0;">
                        <label style="font-size:11px; margin-bottom:2px;">標籤</label>
                        <input type="text" id="edit-post-tag" class="input-base" style="padding:6px 10px; font-size:13px;">
                    </div>
                    <div class="input-group" id="edit-post-sg-sub-container" style="flex:1; margin:0; display:none;">
                        <label style="font-size:11px; margin-bottom:2px; color:#854d0e; font-weight:700;">子分類 <span style="color:#9ca3af; font-size:10px; font-weight:normal;">(選填)</span></label>
                        <input type="text" id="edit-post-sg-sub" class="input-base" style="border:1px solid #facc15; padding:6px 10px; font-size:13px;" placeholder="例如：第一期">
                    </div>
                    <div class="input-group" style="flex:1; margin:0;">
                        <label style="font-size:11px; margin-bottom:2px;">🔑 授權 <span style="color:#9ca3af; font-size:10px;">(選填)</span></label>
                        <input type="text" id="edit-post-auth" class="input-base" style="padding:6px 10px; font-size:13px;" placeholder="拍攝者 / 授權來源">
                    </div>
                </div>`.split('\n'));
}

let result = lines.join('\n');
result = result.replace(/v=\d{10,14}/g, 'v=202610110310');
result = result.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0310"');
fs.writeFileSync('index.html', result);
console.log('HTML patch success');

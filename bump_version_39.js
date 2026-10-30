const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// For Add Modal
const p1 = html.indexOf('<div style="display:flex; gap:6px;">\n                    <div class="input-group" style="flex:1;">\n                        <label style="font-size:11px; margin-bottom:2px;">名稱</label>');
if (p1 !== -1) {
    const p1_end = html.indexOf('</div>', html.indexOf('id="post-auth"')) + 6;
    const addTarget = html.slice(p1, p1_end);
    
    const addReplace = `                <div class="input-group" style="margin:0;">
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
                </div>`;
    
    html = html.replace(addTarget, addReplace);
}

// For Edit Modal
const p2 = html.indexOf('<div class="input-group" id="edit-post-tag-container" style="flex:1; margin:0;">');
if (p2 !== -1) {
    const p2_start = html.lastIndexOf('<div style="display:flex; gap:6px;">', p2);
    const p2_end = html.indexOf('</div>\n                </div>', p2) + 28;
    const editTarget = html.slice(p2_start, p2_end);
    
    const editReplace = `<div style="display:flex; gap:6px;">
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
                </div>`;
    
    html = html.replace(editTarget, editReplace);
}

html = html.replace(/v=\d{10,14}/g, 'v=202610110305');
fs.writeFileSync('index.html', html);
console.log('HTML updated.');

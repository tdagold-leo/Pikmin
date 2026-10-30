const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetAdd = `                <div style="display:flex; gap:6px;">
                    <div class="input-group" style="flex:1;">
                        <label style="font-size:11px; margin-bottom:2px;">名稱</label>
                        <input type="text" id="post-name" class="input-base" placeholder="例如：櫻花美菇" style="padding:6px 10px; font-size:13px;">
                    </div>
                    <div class="input-group" id="post-tag-container" style="flex:1;">
                        <label style="font-size:11px; margin-bottom:2px;">標籤</label>
                        <input type="text" id="post-tag" class="input-base" placeholder="例如：2026櫻花季、稀有" style="padding:6px 10px; font-size:13px;">
                    </div>
                </div>
                <div class="input-group" style="margin:0;">
                    <label style="font-size:11px; margin-bottom:2px;">🔑 授權 <span style="color:#9ca3af; font-size:10px;">(拍攝者 / 授權來源，選填)</span></label>
                    <input type="text" id="post-auth" class="input-base" placeholder="例如：@username 或 官方授權" style="padding:6px 10px; font-size:13px;">
                </div>`;

const replaceAdd = `                <div class="input-group" style="margin:0;">
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
                        <input type="text" id="post-auth" class="input-base" placeholder="拍攝者 / 授權" style="padding:6px 10px; font-size:13px;">
                    </div>
                </div>`;

const targetEdit = `                <div style="display:flex; gap:6px;">
                    <div class="input-group" id="edit-post-tag-container" style="flex:1; margin:0;">
                        <label style="font-size:11px; margin-bottom:2px;">標籤</label>
                        <input type="text" id="edit-post-tag" class="input-base" style="padding:6px 10px; font-size:13px;">
                    </div>
                    <div class="input-group" style="flex:1; margin:0;">
                        <label style="font-size:11px; margin-bottom:2px;">🔑 授權 <span style="color:#9ca3af; font-size:10px;">(選填)</span></label>
                        <input type="text" id="edit-post-auth" class="input-base" style="padding:6px 10px; font-size:13px;" placeholder="拍攝者 / 授權來源">
                    </div>
                </div>`;

const replaceEdit = `                <div style="display:flex; gap:6px;">
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
                        <input type="text" id="edit-post-auth" class="input-base" style="padding:6px 10px; font-size:13px;" placeholder="拍攝者 / 授權">
                    </div>
                </div>`;

if (html.includes(targetAdd) && html.includes(targetEdit)) {
    html = html.replace(targetAdd, replaceAdd);
    html = html.replace(targetEdit, replaceEdit);
    html = html.replace(/v=\d{10,14}/g, 'v=202610110310');
    html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0310"');
    fs.writeFileSync('index.html', html);
    console.log('HTML patch success');
} else {
    console.log('Cannot find targets');
}

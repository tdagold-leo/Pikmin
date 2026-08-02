const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// --- 1. Replace Add Modal's post-sg-fields ---
const addModalOldRegex = /<div id="post-sg-fields"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const addModalNew = `<div id="post-sg-fields" style="display:none; flex-direction:column; gap:6px; background:#fefce8; border:1px solid #fef08a; padding:8px 10px; border-radius:8px;">
                    <div style="display:flex; gap:8px;">
                        <div class="input-group" style="flex:2; margin:0;">
                            <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">活動名稱 (子分類)</label>
                            <input type="text" id="post-sg-activity" class="input-base" placeholder="例如：IKEA / 櫻花季" style="border-color:#fde047; background:#fffbeb; padding:6px 8px; font-size:13px;">
                        </div>
                        <div class="input-group" style="flex:1; margin:0; min-width:80px;">
                            <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">型態</label>
                            <select id="post-sg-type" class="input-base" onchange="if(typeof togglePostcardSgDates==='function') togglePostcardSgDates('post')" style="border-color:#fde047; background:#fffbeb; padding:6px 8px; font-size:13px;">
                                <option value="常駐">常駐</option>
                                <option value="期間">期間</option>
                            </select>
                        </div>
                    </div>
                    <div id="post-sg-dates" style="display:none; flex-direction:column; gap:6px;">
                        <div style="display:flex; flex-direction:row; gap:8px;">
                            <div class="input-group" style="flex:1; margin:0;">
                                <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">開始日期</label>
                                <input type="date" id="post-sg-start" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                            </div>
                            <div class="input-group" style="flex:1; margin:0;">
                                <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">結束日期</label>
                                <input type="date" id="post-sg-end" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:row; gap:8px;">
                            <div class="input-group" style="flex:1; margin:0;">
                                <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">幾天可領取</label>
                                <select id="post-sg-cooldown" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                                    <option value="">(不設定)</option>
                                    <option value="1">1天</option>
                                    <option value="7">7天</option>
                                    <option value="30">一個月</option>
                                </select>
                            </div>
                            <div class="input-group" style="flex:1; margin:0;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                                    <label style="color:#854d0e; margin:0; font-size:11px;">上次領取日期</label>
                                    <button type="button" onclick="setTodayDate('post-sg-last')" style="background:#fef08a; border:1px solid #facc15; color:#854d0e; border-radius:4px; font-size:10px; padding:1px 5px; cursor:pointer; font-weight:bold; line-height:1.2;">今日</button>
                                </div>
                                <input type="date" id="post-sg-last" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                            </div>
                        </div>
                    </div>
                </div>`;

if (addModalOldRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(addModalOldRegex, addModalNew);
    console.log("Patched Add Modal");
} else {
    console.log("Add modal regex failed");
}

// --- 2. Replace Edit Modal's edit-group-postcard header & edit-post-sg-fields ---
const editGroupOldRegex = /<div id="edit-group-postcard" style="display:none; flex-direction:column; gap:8px;">[\s\S]*?<div id="edit-post-created-date"[\s\S]*?<\/div>/;

const editGroupNew = `<div id="edit-group-postcard" style="display:none; flex-direction:column; gap:6px;">
                <div class="input-group" style="margin:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                        <label style="margin:0; font-size:12px;">種類</label>
                        <span id="edit-post-created-date" style="font-size:11px; color:var(--text-muted); font-weight:bold;"></span>
                    </div>
                    <select id="edit-post-type" class="input-base" style="padding:6px 10px; font-size:13px;" onchange="togglePostcardTimeEdit(); if(typeof togglePostcardSgFields==='function') togglePostcardSgFields('edit-post')">
                        <option value="菇">菇</option><option value="花">花</option><option value="菇窩">菇窩</option><option value="隱藏">隱藏</option><option value="特殊金盆">特殊金盆</option><option value="節慶蘑菇">節慶蘑菇</option>
                    </select>
                </div>
                <div id="edit-post-sg-fields" style="display:none; flex-direction:column; gap:6px; background:#fefce8; border:1px solid #fef08a; padding:8px 10px; border-radius:8px;">
                    <div style="display:flex; gap:8px;">
                        <div class="input-group" style="flex:2; margin:0;">
                            <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">活動名稱 (子分類)</label>
                            <input type="text" id="edit-post-sg-activity" class="input-base" placeholder="例如：IKEA / 櫻花季" style="border-color:#fde047; background:#fffbeb; padding:6px 8px; font-size:13px;">
                        </div>
                        <div class="input-group" style="flex:1; margin:0; min-width:80px;">
                            <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">型態</label>
                            <select id="edit-post-sg-type" class="input-base" onchange="if(typeof togglePostcardSgDates==='function') togglePostcardSgDates('edit-post')" style="border-color:#fde047; background:#fffbeb; padding:6px 8px; font-size:13px;">
                                <option value="常駐">常駐</option>
                                <option value="期間">期間</option>
                            </select>
                        </div>
                    </div>
                    <div id="edit-post-sg-dates" style="display:none; flex-direction:column; gap:6px;">
                        <div style="display:flex; flex-direction:row; gap:8px;">
                            <div class="input-group" style="flex:1; margin:0;">
                                <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">開始日期</label>
                                <input type="date" id="edit-post-sg-start" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                            </div>
                            <div class="input-group" style="flex:1; margin:0;">
                                <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">結束日期</label>
                                <input type="date" id="edit-post-sg-end" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:row; gap:8px;">
                            <div class="input-group" style="flex:1; margin:0;">
                                <label style="color:#854d0e; font-size:11px; margin-bottom:2px;">幾天可領取</label>
                                <select id="edit-post-sg-cooldown" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                                    <option value="">(不設定)</option>
                                    <option value="1">1天</option>
                                    <option value="7">7天</option>
                                    <option value="30">一個月</option>
                                </select>
                            </div>
                            <div class="input-group" style="flex:1; margin:0;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                                    <label style="color:#854d0e; margin:0; font-size:11px;">上次領取日期</label>
                                    <button type="button" onclick="setTodayDate('edit-post-sg-last')" style="background:#fef08a; border:1px solid #facc15; color:#854d0e; border-radius:4px; font-size:10px; padding:1px 5px; cursor:pointer; font-weight:bold; line-height:1.2;">今日</button>
                                </div>
                                <input type="date" id="edit-post-sg-last" class="input-base" style="border-color:#fde047; background:#fffbeb; padding:5px 8px; font-size:12px;">
                            </div>
                        </div>
                    </div>
                </div>`;

if (editGroupOldRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(editGroupOldRegex, editGroupNew);
    console.log("Patched Edit Modal");
} else {
    console.log("Edit modal regex failed");
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

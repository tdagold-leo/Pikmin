const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const regexAdd = /<label style="color:#854d0e;">上次領取日期<\/label>\s*<input type="date" id="post-sg-last" class="input-base" style="border-color:#fde047; background:#fffbeb;">/;
const replaceAdd = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <label style="color:#854d0e; margin:0;">上次領取日期</label>
                                    <button type="button" onclick="setTodayDate('post-sg-last')" style="background:#fef08a; border:1px solid #facc15; color:#854d0e; border-radius:4px; font-size:11px; padding:1px 6px; cursor:pointer; font-weight:bold; line-height:1.2;">今日</button>
                                </div>
                                <input type="date" id="post-sg-last" class="input-base" style="border-color:#fde047; background:#fffbeb;">`;

const regexEdit = /<label style="color:#854d0e;">上次領取日期<\/label>\s*<input type="date" id="edit-post-sg-last" class="input-base" style="border-color:#fde047; background:#fffbeb;">/;
const replaceEdit = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <label style="color:#854d0e; margin:0;">上次領取日期</label>
                                    <button type="button" onclick="setTodayDate('edit-post-sg-last')" style="background:#fef08a; border:1px solid #facc15; color:#854d0e; border-radius:4px; font-size:11px; padding:1px 6px; cursor:pointer; font-weight:bold; line-height:1.2;">今日</button>
                                </div>
                                <input type="date" id="edit-post-sg-last" class="input-base" style="border-color:#fde047; background:#fffbeb;">`;

if (regexAdd.test(indexHtml) && regexEdit.test(indexHtml)) {
    indexHtml = indexHtml.replace(regexAdd, replaceAdd).replace(regexEdit, replaceEdit);
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
    console.log("Successfully patched index.html with 今日 buttons");
} else {
    console.log("Regex did not match");
}

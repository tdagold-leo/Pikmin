const fs = require('fs');
const filename = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let content = fs.readFileSync(filename, 'utf-8');

const target1 = `                    <button id="cloud-startBtn" class="btn-primary" style="margin-bottom: 20px;">開始產生信箱</button>`;
const replacement1 = `                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button id="cloud-startBtn" class="btn-primary" style="flex: 1; margin: 0;">開始產生信箱</button>
                        <a href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" class="btn-primary" style="flex: 1; margin: 0; display: flex; align-items: center; justify-content: center; text-decoration: none; background: linear-gradient(135deg, #10b981, #059669); border: none; padding: 0;">
                            🍄 開啟 Pikmin
                        </a>
                    </div>`;

const target2 = `                    <a href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" class="btn-primary" style="display: block; text-align: center; margin-top: 20px; text-decoration: none; background: linear-gradient(135deg, #10b981, #059669); border: none;">
                        🍄 立即開啟 Pikmin Bloom
                    </a>`;
const replacement2 = ``;

if (content.includes(target1) && content.includes(target2)) {
    content = content.replace(target1, replacement1);
    content = content.replace(target2, replacement2);
    // 移除多餘的空行 (optional, but keeps it clean)
    content = content.replace(/\n\s*\n\s*<\/div>\s*<div class="log-container"/g, '\n                </div>\n\n                <div class="log-container"');
    fs.writeFileSync(filename, content, 'utf-8');
    console.log('Success');
} else {
    console.log('Target not found');
    if (!content.includes(target1)) console.log('target1 missing');
    if (!content.includes(target2)) console.log('target2 missing');
}

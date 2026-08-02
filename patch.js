const fs = require('fs');

const filename = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let content = fs.readFileSync(filename, 'utf-8');

const target = `                    <div class="input-group">
                        <label for="cloud-referralCode">Pikmin 邀請碼</label>
                        <input type="text" id="cloud-referralCode" placeholder="請輸入大寫英文字母" value="NLSPYIBHN">
                    </div>`;

const replacement = `                    <div class="input-group">
                        <label for="cloud-referralCode">Pikmin 邀請碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-referralCode" placeholder="請輸入大寫英文字母" value="NLSPYIBHN" style="flex: 1;">
                            <button id="cloud-copyRefCodeBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="input-group" style="margin-top: 15px;">
                        <label for="cloud-password">Nintendo 密碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-password" value="Pikmin123!@" style="flex: 1;" readonly>
                            <button id="cloud-copyPwdBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
                            </button>
                        </div>
                    </div>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filename, content, 'utf-8');
    console.log('Success');
} else {
    console.log('Target not found');
}

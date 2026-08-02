const fs = require('fs');

// Patch index.html
const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

// 1. Add ID to openPikminBtn
const targetBtn = `<a href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" class="btn-primary" style="flex: 1;`;
const replacementBtn = `<a id="cloud-openPikminBtn" href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" class="btn-primary" style="flex: 1;`;
indexContent = indexContent.replace(targetBtn, replacementBtn);

// 2. Add Invite Link input group
const targetInputs = `                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-referralCode">Pikmin 邀請碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-referralCode" placeholder="請輸入大寫英文字母" value="NLSPYIBHN" style="flex: 1;">
                            <button id="cloud-copyRefCodeBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
                            </button>
                        </div>
                    </div>`;
const replacementInputs = `                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="cloud-referralCode">Pikmin 邀請碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-referralCode" placeholder="請輸入大寫英文字母" value="NLSPYIBHN" style="flex: 1;">
                            <button id="cloud-copyRefCodeBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
                            </button>
                        </div>
                    </div>

                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-inviteLink">Pikmin 邀請連結 (自訂)</label>
                        <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="width: 100%; border-radius: 8px;">
                    </div>`;

indexContent = indexContent.replace(targetInputs, replacementInputs);
fs.writeFileSync(indexFile, indexContent, 'utf-8');
console.log('index.html patched.');

// Patch js/main.js
const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const targetJS = `        const pwdInput = document.getElementById('cloud-password');
        const copyPwdBtn = document.getElementById('cloud-copyPwdBtn');
        if (copyPwdBtn && pwdInput) {
            copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value, this);
            });
        }`;

const replacementJS = targetJS + `

        const inviteLinkInput = document.getElementById('cloud-inviteLink');
        const openPikminBtn = document.getElementById('cloud-openPikminBtn');
        if (inviteLinkInput && openPikminBtn) {
            inviteLinkInput.addEventListener('input', function() {
                const val = this.value.trim();
                if (val) {
                    openPikminBtn.href = val;
                } else {
                    openPikminBtn.href = 'https://pikminbloom.onelink.me/pWSt/73s4bj4n'; // default
                }
            });
        }`;

if (jsContent.includes(targetJS)) {
    jsContent = jsContent.replace(targetJS, replacementJS);
    fs.writeFileSync(jsFile, jsContent, 'utf-8');
    console.log('main.js patched.');
} else {
    console.log('Target JS not found');
}

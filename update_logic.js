const fs = require('fs');

// Patch index.html
const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

// 1. Remove Referral Code section
const refCodeTarget = `                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="cloud-referralCode">Pikmin 邀請碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-referralCode" placeholder="請輸入大寫英文字母" value="NLSPYIBHN" style="flex: 1;">
                            <button id="cloud-copyRefCodeBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
                            </button>
                        </div>
                    </div>`;
if (indexContent.includes(refCodeTarget)) {
    indexContent = indexContent.replace(refCodeTarget, '');
}

// 2. Update Email Button Text
indexContent = indexContent.replace('<span>複製信箱 (去任天堂註冊)</span>', '<span>複製信箱 & 開啟 Pikmin</span>');

// 3. Update Password Group
const pwdTarget = `                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="cloud-password">Nintendo 密碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-password" value="Pikmin123!@" style="flex: 1;" readonly>
                            <button id="cloud-copyPwdBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
                            </button>
                        </div>
                    </div>`;

const pwdReplacement = `                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="cloud-password">Nintendo 密碼</label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <input type="text" id="cloud-password" value="Pikmin123!@" style="width: 100%; border-radius: 8px; font-size: 16px; padding: 10px 15px; box-sizing: border-box;" readonly>
                            <button id="cloud-copyPwdBtn" class="copy-btn" style="width: 100%; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span>複製密碼 & 開啟 Pikmin</span>
                            </button>
                        </div>
                    </div>`;
if (indexContent.includes(pwdTarget)) {
    indexContent = indexContent.replace(pwdTarget, pwdReplacement);
}

fs.writeFileSync(indexFile, indexContent, 'utf-8');
console.log('index.html updated.');


// Patch js/main.js
const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

// 1. Email click listener update
const emailTarget = `copyEmailBtn.onclick = () => copyToClipboard(address, copyEmailBtn);`;
const emailReplacement = `copyEmailBtn.onclick = () => {
                    copyToClipboard(address, copyEmailBtn);
                    const openBtn = document.getElementById('cloud-openPikminBtn');
                    if (openBtn) window.location.href = openBtn.href;
                };`;
if (jsContent.includes(emailTarget)) {
    jsContent = jsContent.replace(emailTarget, emailReplacement);
} else {
    console.log('Email JS logic target not found.');
}

// 2. Password click listener update
const pwdJsTarget = `        const pwdInput = document.getElementById('cloud-password');
        const copyPwdBtn = document.getElementById('cloud-copyPwdBtn');
        if (copyPwdBtn && pwdInput) {
            copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value, this);
            });
        }`;
const pwdJsReplacement = `        const pwdInput = document.getElementById('cloud-password');
        const copyPwdBtn = document.getElementById('cloud-copyPwdBtn');
        if (copyPwdBtn && pwdInput) {
            copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value, this);
                const openBtn = document.getElementById('cloud-openPikminBtn');
                if (openBtn) window.location.href = openBtn.href;
            });
        }`;
if (jsContent.includes(pwdJsTarget)) {
    jsContent = jsContent.replace(pwdJsTarget, pwdJsReplacement);
} else {
    // try regex for password click if exact match fails
    const pwdRegex = /copyPwdBtn\.addEventListener\('click', function\(\) \{\s*copyToClipboard\(pwdInput\.value, this\);\s*\}\);/;
    if (pwdRegex.test(jsContent)) {
        jsContent = jsContent.replace(pwdRegex, `copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value, this);
                const openBtn = document.getElementById('cloud-openPikminBtn');
                if (openBtn) window.location.href = openBtn.href;
            });`);
    } else {
        console.log('Password JS logic target not found.');
    }
}

// 3. Clean up referral code event listener
const refJsRegex = /\/\/ 綁定新加入的複製按鈕\s*const copyRefCodeBtn = document\.getElementById\('cloud-copyRefCodeBtn'\);\s*if \(copyRefCodeBtn && referralCodeInput\) \{\s*copyRefCodeBtn\.addEventListener\('click', function\(\) \{\s*copyToClipboard\(referralCodeInput\.value, this\);\s*\}\);\s*\}/;
if (refJsRegex.test(jsContent)) {
    jsContent = jsContent.replace(refJsRegex, '');
}

fs.writeFileSync(jsFile, jsContent, 'utf-8');
console.log('main.js updated.');

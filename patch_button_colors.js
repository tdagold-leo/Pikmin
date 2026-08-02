const fs = require('fs');

// 1. Update index.html
const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

// Update CSS
const cssTarget = `        .cloud-app .copy-btn {
            background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 10px 15px; border-radius: 8px; font-size: 14px; cursor: pointer; width: 100%;
            display: flex; justify-content: center; align-items: center; gap: 8px; transition: all 0.2s;
        }
        .cloud-app .copy-btn:hover { background: rgba(255,255,255,0.15); }
        .cloud-app .copy-btn.success { background: rgba(34, 197, 94, 0.2); border-color: #22c55e; color: #22c55e; }`;

const cssReplacement = `        .cloud-app .copy-btn {
            padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; width: 100%;
            display: flex; justify-content: center; align-items: center; gap: 8px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid transparent; text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        .cloud-app .copy-btn:disabled {
            opacity: 0.45; cursor: not-allowed; background: rgba(255, 255, 255, 0.06) !important;
            border-color: rgba(255, 255, 255, 0.08) !important; color: #64748b !important;
            box-shadow: none !important; animation: none !important; transform: none !important;
        }
        /* 步驟 1: 複製信箱按鈕 (亮藍色漸層) */
        .cloud-app .btn-copy-email {
            background: linear-gradient(135deg, #0284c7, #0369a1); color: white;
            box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .cloud-app .btn-copy-email:hover:not(:disabled) {
            background: linear-gradient(135deg, #0369a1, #075985);
            box-shadow: 0 6px 18px rgba(2, 132, 199, 0.6); transform: translateY(-2px);
        }
        /* 步驟 2: 複製密碼按鈕 (紫羅蘭色漸層) */
        .cloud-app .btn-copy-pwd {
            background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
            box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); border: 1px solid rgba(165, 180, 252, 0.3);
        }
        .cloud-app .btn-copy-pwd:hover:not(:disabled) {
            background: linear-gradient(135deg, #4f46e5, #4338ca);
            box-shadow: 0 6px 18px rgba(99, 102, 241, 0.6); transform: translateY(-2px);
        }
        /* 步驟 3: 複製驗證碼按鈕 (收到後超醒目翠綠脈衝光) */
        .cloud-app .btn-copy-code {
            background: linear-gradient(135deg, #10b981, #059669); color: white;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); border: 1px solid rgba(52, 211, 153, 0.3);
        }
        .cloud-app .btn-copy-code.code-ready {
            background: linear-gradient(135deg, #10b981, #047857) !important; color: white !important;
            border: 1px solid #34d399 !important; animation: readyPulse 1.6s infinite ease-in-out;
        }
        .cloud-app .btn-copy-code:hover:not(:disabled) {
            transform: translateY(-2px); box-shadow: 0 6px 18px rgba(16, 185, 129, 0.6);
        }
        @keyframes readyPulse {
            0%, 100% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.7), 0 4px 12px rgba(0,0,0,0.3); transform: scale(1); }
            50% { box-shadow: 0 0 24px rgba(16, 185, 129, 0.95), 0 6px 16px rgba(0,0,0,0.4); transform: scale(1.02); }
        }
        /* 提示氣泡提醒卡 */
        .cloud-app .ready-toast {
            margin-bottom: 12px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1));
            border: 1px solid rgba(52, 211, 153, 0.5); border-radius: 8px; padding: 10px 14px;
            color: #6ee7b7; font-size: 13px; font-weight: 700; text-align: center;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            animation: slideDown 0.3s ease-out; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
        }
        .cloud-app .copy-btn.success { background: #22c55e !important; border-color: #22c55e !important; color: white !important; }`;

if (indexContent.includes(cssTarget)) {
    indexContent = indexContent.replace(cssTarget, cssReplacement);
}

// Update HTML markup for buttons and titles
const htmlTarget = `                    <!-- 信箱顯示區塊 -->
                    <div id="cloud-emailBox" class="info-box" style="margin-bottom: 20px;">
                        <div class="info-title">臨時任天堂信箱</div>
                        <div id="cloud-emailDisplay" class="info-value" style="font-size: 18px; word-break: break-all; margin: 10px 0;">--</div>
                        <button id="cloud-copyEmailBtn" class="copy-btn">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span>複製信箱 & 開啟 Pikmin</span>
                        </button>
                    </div>

                    <!-- Nintendo 密碼 -->
                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="cloud-password">Nintendo 密碼</label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <input type="text" id="cloud-password" value="Pikmin123!@" style="width: 100%; border-radius: 8px; font-size: 16px; padding: 10px 15px; box-sizing: border-box;" readonly>
                            <button id="cloud-copyPwdBtn" class="copy-btn" style="width: 100%; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span>複製密碼 & 開啟 Pikmin</span>
                            </button>
                        </div>
                    </div>

                    <!-- 驗證碼顯示區塊 -->
                    <div id="cloud-codeBox" class="info-box" style="margin-bottom: 20px;">
                        <div id="cloud-loadingBar" class="pulsing"></div>
                        <div class="info-title">任天堂驗證碼 (等待中...)</div>
                        <div id="cloud-codeDisplay" class="info-value">--</div>
                        <button id="cloud-copyCodeBtn" class="copy-btn" disabled>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span>複製驗證碼 & 開啟 Pikmin</span>
                        </button>
                    </div>`;

const htmlReplacement = `                    <!-- 信箱顯示區塊 -->
                    <div id="cloud-emailBox" class="info-box" style="margin-bottom: 20px;">
                        <div class="info-title">步驟 1：臨時任天堂信箱</div>
                        <div id="cloud-emailDisplay" class="info-value" style="font-size: 18px; word-break: break-all; margin: 10px 0; color: #38bdf8;">--</div>
                        <button id="cloud-copyEmailBtn" class="copy-btn btn-copy-email">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span>📋 複製信箱 & 開啟 Pikmin</span>
                        </button>
                    </div>

                    <!-- Nintendo 密碼 -->
                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="cloud-password">步驟 2：Nintendo 密碼</label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <input type="text" id="cloud-password" value="Pikmin123!@" style="width: 100%; border-radius: 8px; font-size: 16px; padding: 10px 15px; box-sizing: border-box;" readonly>
                            <button id="cloud-copyPwdBtn" class="copy-btn btn-copy-pwd" style="width: 100%; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span>🔑 複製密碼 & 開啟 Pikmin</span>
                            </button>
                        </div>
                    </div>

                    <!-- 驗證碼顯示區塊 -->
                    <div id="cloud-codeBox" class="info-box" style="margin-bottom: 20px;">
                        <div id="cloud-loadingBar" class="pulsing"></div>
                        <div class="info-title">步驟 3：任天堂驗證碼 (等待中...)</div>
                        <div id="cloud-codeReminder" class="ready-toast" style="display: none;">
                            🎉 驗證碼已送達！請點擊下方按鈕複製並完成註冊！
                        </div>
                        <div id="cloud-codeDisplay" class="info-value" style="color: #34d399;">--</div>
                        <button id="cloud-copyCodeBtn" class="copy-btn btn-copy-code" disabled>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span>✨ 複製驗證碼 & 開啟 Pikmin</span>
                        </button>
                    </div>`;

if (indexContent.includes(htmlTarget)) {
    indexContent = indexContent.replace(htmlTarget, htmlReplacement);
    fs.writeFileSync(indexFile, indexContent, 'utf-8');
    console.log('index.html updated successfully.');
} else {
    console.log('HTML target string not found in index.html');
}

// 2. Update js/main.js
const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

// Update runAutomation in main.js
const jsTarget = `                log('📬 開始監聽任天堂驗證信...');
                codeBox.classList.add('active');
                loadingBar.style.display = 'block';
                codeDisplay.textContent = '--';
                const codeTitle = document.querySelector('#cloud-codeBox .info-title');
                if (codeTitle) codeTitle.textContent = '任天堂驗證碼 (等待中...)';
                copyCodeBtn.disabled = true;
                copyCodeBtn.onclick = null;`;

const jsReplacement = `                log('📬 開始監聽任天堂驗證信...');
                codeBox.classList.add('active');
                loadingBar.style.display = 'block';
                codeDisplay.textContent = '--';
                const codeReminder = document.getElementById('cloud-codeReminder');
                if (codeReminder) codeReminder.style.display = 'none';
                const codeTitle = document.querySelector('#cloud-codeBox .info-title');
                if (codeTitle) codeTitle.textContent = '步驟 3：任天堂驗證碼 (等待信件中...)';
                copyCodeBtn.disabled = true;
                copyCodeBtn.classList.remove('code-ready');
                copyCodeBtn.onclick = null;`;

if (jsContent.includes(jsTarget)) {
    jsContent = jsContent.replace(jsTarget, jsReplacement);
}

const jsTargetSuccess = `                if (verificationCode) {
                    log(\`✅ 成功取得驗證碼：\${verificationCode}\`, 'log-success');
                    loadingBar.style.display = 'none';
                    if (codeTitle) codeTitle.textContent = '任天堂驗證碼 (點擊下方複製)';
                    codeDisplay.textContent = verificationCode;
                    copyCodeBtn.disabled = false;
                    copyCodeBtn.onclick = () => {
                        copyToClipboard(verificationCode, copyCodeBtn);
                        if (openPikminBtn) {
                            window.location.href = openPikminBtn.href;
                        }
                    };`;

const jsReplacementSuccess = `                if (verificationCode) {
                    log(\`✅ 成功取得驗證碼：\${verificationCode}\`, 'log-success');
                    loadingBar.style.display = 'none';
                    if (codeTitle) codeTitle.textContent = '步驟 3：任天堂驗證碼 (已送達！)';
                    if (codeReminder) codeReminder.style.display = 'flex';
                    codeDisplay.textContent = verificationCode;
                    copyCodeBtn.disabled = false;
                    copyCodeBtn.classList.add('code-ready');
                    if (navigator.vibrate) {
                        try { navigator.vibrate([100, 50, 100]); } catch(e) {}
                    }
                    copyCodeBtn.onclick = () => {
                        copyToClipboard(verificationCode, copyCodeBtn);
                        if (openPikminBtn) {
                            window.location.href = openPikminBtn.href;
                        }
                    };`;

if (jsContent.includes(jsTargetSuccess)) {
    jsContent = jsContent.replace(jsTargetSuccess, jsReplacementSuccess);
}

fs.writeFileSync(jsFile, jsContent, 'utf-8');
console.log('main.js updated successfully.');

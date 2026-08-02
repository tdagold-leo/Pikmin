const fs = require('fs');

const filename = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let content = fs.readFileSync(filename, 'utf-8');

const regex = /<div class="card">\s*<div class="input-group">[\s\S]*?<!-- 驗證碼顯示區塊 -->[\s\S]*?<\/div>\s*<\/div>/;

const replacement = `<div class="card">
                    <button id="cloud-startBtn" class="btn-primary" style="margin-bottom: 20px;">開始產生信箱</button>

                    <!-- 信箱顯示區塊 -->
                    <div id="cloud-emailBox" class="info-box" style="margin-bottom: 20px;">
                        <div class="info-title">臨時任天堂信箱</div>
                        <div id="cloud-emailDisplay" class="info-value">--</div>
                        <button id="cloud-copyEmailBtn" class="copy-btn">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span>複製信箱 (去任天堂註冊)</span>
                        </button>
                    </div>

                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="cloud-password">Nintendo 密碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-password" value="Pikmin123!@" style="flex: 1;" readonly>
                            <button id="cloud-copyPwdBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
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
                            <span>複製驗證碼</span>
                        </button>
                    </div>

                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-referralCode">Pikmin 邀請碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-referralCode" placeholder="請輸入大寫英文字母" value="NLSPYIBHN" style="flex: 1;">
                            <button id="cloud-copyRefCodeBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span style="display: none;">複製</span>
                            </button>
                        </div>
                    </div>
                </div>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filename, content, 'utf-8');
    console.log('Success');
} else {
    console.log('Regex did not match');
}

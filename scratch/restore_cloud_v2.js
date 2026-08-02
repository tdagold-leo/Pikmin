const fs = require('fs');
const path = require('path');

// 1. Update index.html
const indexHtmlPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf-8').replace(/\r\n/g, '\n');

const oldViewCloudRegex = /<section id="view-cloud" class="view-section cloud-app">[\s\S]*?<\/section>/;

const newViewCloud = `<section id="view-cloud" class="view-section cloud-app">
            <div class="container">
                <header>
                    <h1>Pikmin 自動註冊</h1>
                    <div class="subtitle">Cloud SPA 版・免洗帳號與邀請碼工具</div>
                </header>

                <div class="card">
                    <!-- Pikmin 邀請碼 -->
                    <div class="input-group" style="margin-bottom: 15px;">
                        <label for="cloud-referralCode">Pikmin 邀請碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-referralCode" placeholder="請輸入大寫英文字母" value="NLSPYIBHN" style="flex: 1;">
                            <button id="cloud-copyRefCodeBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;" title="複製邀請碼">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span>複製</span>
                            </button>
                        </div>
                    </div>

                    <!-- Nintendo 預設密碼 -->
                    <div class="input-group" style="margin-bottom: 15px;">
                        <label for="cloud-password">Nintendo 預設密碼</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-password" value="Pikmin123!@" style="flex: 1;" readonly>
                            <button id="cloud-copyPwdBtn" class="copy-btn" style="width: auto; padding: 0 15px; margin: 0;" title="複製密碼">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span>複製</span>
                            </button>
                        </div>
                    </div>

                    <!-- Pikmin 邀請連結（自訂）與儲存管理 -->
                    <div class="input-group" style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label for="cloud-inviteLink" style="margin: 0;">Pikmin 邀請連結 (自訂)</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <label style="font-size: 13px; color: #a1a1aa; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                    <input type="checkbox" id="cloud-isPublic" checked style="cursor: pointer;"> 公開
                                </label>
                                <button id="cloud-saveInviteBtn" type="button" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 4px; padding: 0;">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    儲存
                                </button>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-inviteName" placeholder="名稱 (例:小明)" style="width: 110px; border-radius: 8px; padding: 10px; box-sizing: border-box; font-size: 14px; flex-shrink: 0;">
                            <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="flex: 1; border-radius: 8px; padding: 10px; box-sizing: border-box; font-size: 14px; min-width: 0;">
                        </div>

                        <!-- 雙清單管理（折疊式） -->
                        <details style="margin-top: 12px;">
                            <summary style="cursor: pointer; font-size: 13px; color: #94a3b8; outline: none; padding: 4px 0; user-select: none; font-weight: bold;">
                                🔒 私有清單 (本機儲存・點此展開)
                            </summary>
                            <div id="cloud-savedLocalLinksList" style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
                            </div>
                        </details>
                        <details style="margin-top: 8px;">
                            <summary style="cursor: pointer; font-size: 13px; color: #94a3b8; outline: none; padding: 4px 0; user-select: none; font-weight: bold;">
                                🌐 公開清單 (雲端共享・點此展開)
                            </summary>
                            <div id="cloud-savedPublicLinksList" style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
                            </div>
                        </details>
                    </div>

                    <!-- 操作按鈕列：產生信箱 與 開啟 Pikmin App -->
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button id="cloud-startBtn" class="btn-primary" style="flex: 1.2;">🚀 開始產生信箱</button>
                        <a id="cloud-openPikminBtn" href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" class="btn-primary" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; text-align: center; background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">🌱 開啟遊戲</a>
                    </div>

                    <!-- 信箱顯示區塊 -->
                    <div id="cloud-emailBox" class="info-box">
                        <div class="info-title">臨時任天堂信箱</div>
                        <div id="cloud-emailDisplay" class="info-value">--</div>
                        <button id="cloud-copyEmailBtn" class="copy-btn">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span>複製信箱 (去任天堂註冊)</span>
                        </button>
                    </div>

                    <!-- 驗證碼顯示區塊 -->
                    <div id="cloud-codeBox" class="info-box">
                        <div id="cloud-loadingBar" class="pulsing"></div>
                        <div class="info-title">任天堂驗證碼 (等待中...)</div>
                        <div id="cloud-codeDisplay" class="info-value">--</div>
                        <button id="cloud-copyCodeBtn" class="copy-btn" disabled>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span>複製驗證碼</span>
                        </button>
                    </div>
                </div>

                <div class="log-container" id="cloud-logContainer">
                    <div class="log-entry">準備就緒。點擊「開始」以啟動純網頁版自動化流程...</div>
                </div>
            </div>
        </section>`;

if (oldViewCloudRegex.test(html)) {
    html = html.replace(oldViewCloudRegex, newViewCloud);
    fs.writeFileSync(indexHtmlPath, html, 'utf-8');
    console.log('[OK] Patched index.html with new view-cloud section');
} else {
    console.error('[ERROR] Could not find view-cloud section in index.html');
}

// 2. Update js/main.js
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8').replace(/\r\n/g, '\n');

const oldCloudJsRegex = /\/\/ ===== 雲端自動註冊小幫手邏輯 =====[\s\S]*?\n\s*\/\/ ===== Google Maps 邏輯 =====/;

const newCloudJs = `// ===== 雲端自動註冊小幫手邏輯 =====
    (function() {
        const logContainer = document.getElementById('cloud-logContainer');
        const startBtn = document.getElementById('cloud-startBtn');
        const referralCodeInput = document.getElementById('cloud-referralCode');
        const copyRefCodeBtn = document.getElementById('cloud-copyRefCodeBtn');
        const pwdInput = document.getElementById('cloud-password');
        const copyPwdBtn = document.getElementById('cloud-copyPwdBtn');
        const inviteLinkInput = document.getElementById('cloud-inviteLink');
        const inviteNameInput = document.getElementById('cloud-inviteName');
        const openPikminBtn = document.getElementById('cloud-openPikminBtn');
        const saveInviteBtn = document.getElementById('cloud-saveInviteBtn');
        const isPublicCheckbox = document.getElementById('cloud-isPublic');
        const savedLocalLinksList = document.getElementById('cloud-savedLocalLinksList');
        const savedPublicLinksList = document.getElementById('cloud-savedPublicLinksList');

        const emailBox = document.getElementById('cloud-emailBox');
        const emailDisplay = document.getElementById('cloud-emailDisplay');
        const copyEmailBtn = document.getElementById('cloud-copyEmailBtn');

        const codeBox = document.getElementById('cloud-codeBox');
        const codeDisplay = document.getElementById('cloud-codeDisplay');
        const copyCodeBtn = document.getElementById('cloud-copyCodeBtn');
        const loadingBar = document.getElementById('cloud-loadingBar');

        // 綁定複製邀請碼與密碼按鈕
        if (copyRefCodeBtn && referralCodeInput) {
            copyRefCodeBtn.addEventListener('click', function() {
                copyToClipboard(referralCodeInput.value.trim(), this);
            });
        }
        if (copyPwdBtn && pwdInput) {
            copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value.trim(), this);
            });
        }

        // 綁定自訂邀請連結
        if (inviteLinkInput && openPikminBtn) {
            inviteLinkInput.addEventListener('input', function() {
                const val = this.value.trim();
                openPikminBtn.href = val || 'https://pikminbloom.onelink.me/pWSt/73s4bj4n';
            });
        }

        // ===== 邀請連結管理邏輯 (Firebase 公開清單 & LocalStorage 私有清單) =====
        if (inviteLinkInput && openPikminBtn && saveInviteBtn && savedLocalLinksList && savedPublicLinksList) {
            function getLocalInvites() {
                try {
                    return JSON.parse(localStorage.getItem('pikmin_local_invites') || '{}');
                } catch(e) { return {}; }
            }
            function setLocalInvites(data) {
                localStorage.setItem('pikmin_local_invites', JSON.stringify(data));
            }
            
            function createListElement(item) {
                const el = document.createElement('div');
                el.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);';
                
                const leftDiv = document.createElement('div');
                leftDiv.style.cssText = 'flex: 1; cursor: pointer; overflow: hidden;';
                const icon = item.isLocal ? '🔒 ' : '🌐 ';
                leftDiv.innerHTML = \`
                    <div style="font-weight: bold; font-size: 13px; color: #f8fafc;">\${icon}\${escapeHtml(item.name)}</div>
                    <div style="font-size: 11px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${escapeHtml(item.link)}</div>
                \`;
                leftDiv.onclick = () => {
                    if (inviteNameInput) {
                        inviteNameInput.value = item.name;
                        inviteNameInput.style.border = '2px solid #10b981';
                    }
                    inviteLinkInput.value = item.link;
                    openPikminBtn.href = item.link;
                    inviteLinkInput.style.border = '2px solid #10b981';
                    setTimeout(() => {
                        inviteLinkInput.style.border = '';
                        if (inviteNameInput) inviteNameInput.style.border = '';
                    }, 1000);
                };

                const rightDiv = document.createElement('div');
                rightDiv.style.cssText = 'display: flex; gap: 8px; margin-left: 10px;';

                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.innerHTML = '✏️';
                editBtn.title = '修改名稱';
                editBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 2px 4px; font-size: 13px;';
                editBtn.onclick = () => {
                    const newName = prompt('修改名稱：', item.name);
                    if (newName && newName.trim() && newName.trim() !== item.name) {
                        if (item.isLocal) {
                            const data = getLocalInvites();
                            if(data[item.id]) data[item.id].name = newName.trim();
                            setLocalInvites(data);
                            renderAllInvites();
                        } else if (typeof database !== 'undefined') {
                            database.ref('shared_invites/' + item.id).update({ name: newName.trim() });
                        }
                    }
                };

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.innerHTML = '🗑️';
                delBtn.title = '刪除連結';
                delBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 2px 4px; font-size: 13px;';
                delBtn.onclick = () => {
                    if (confirm(\`確定要刪除「\${item.name}」的連結嗎？\`)) {
                        if (item.isLocal) {
                            const data = getLocalInvites();
                            delete data[item.id];
                            setLocalInvites(data);
                            renderAllInvites();
                        } else if (typeof database !== 'undefined') {
                            database.ref('shared_invites/' + item.id).remove();
                        }
                    }
                };

                rightDiv.appendChild(editBtn);
                rightDiv.appendChild(delBtn);
                
                el.appendChild(leftDiv);
                el.appendChild(rightDiv);
                return el;
            }

            function renderAllInvites() {
                savedLocalLinksList.innerHTML = '';
                savedPublicLinksList.innerHTML = '';
                
                // Fetch local
                const localData = getLocalInvites();
                let localEntries = Object.keys(localData).map(key => ({ id: key, isLocal: true, ...localData[key] }));
                localEntries.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
                
                if (localEntries.length === 0) {
                    savedLocalLinksList.innerHTML = '<div style="font-size:12px; color:#64748b; text-align:center; padding:4px 0;">目前沒有私有連結</div>';
                } else {
                    localEntries.forEach(item => savedLocalLinksList.appendChild(createListElement(item)));
                }

                // Fetch public
                let publicEntries = [];
                if (window._latestFirebaseInvites) {
                    const fbData = window._latestFirebaseInvites;
                    publicEntries = Object.keys(fbData).map(key => ({ id: key, isLocal: false, ...fbData[key] }));
                }
                publicEntries.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
                
                if (publicEntries.length === 0) {
                    savedPublicLinksList.innerHTML = '<div style="font-size:12px; color:#64748b; text-align:center; padding:4px 0;">目前沒有公開連結</div>';
                } else {
                    publicEntries.forEach(item => savedPublicLinksList.appendChild(createListElement(item)));
                }
            }

            // 儲存邏輯
            saveInviteBtn.addEventListener('click', () => {
                const link = inviteLinkInput.value.trim();
                const name = inviteNameInput ? inviteNameInput.value.trim() : '';
                if (!name) {
                    alert('請在左側輸入名稱！');
                    return;
                }
                if (!link) {
                    alert('請在右側輸入邀請連結！');
                    return;
                }
                
                const isPublic = isPublicCheckbox && isPublicCheckbox.checked;
                const newObj = {
                    name: name,
                    link: link,
                    createdAt: Date.now()
                };

                if (isPublic && typeof database !== 'undefined') {
                    database.ref('shared_invites').push(newObj);
                } else {
                    const localData = getLocalInvites();
                    const newId = 'local_' + Date.now() + '_' + Math.floor(Math.random()*1000);
                    localData[newId] = newObj;
                    setLocalInvites(localData);
                    renderAllInvites();
                }

                if (inviteNameInput) inviteNameInput.value = '';
                inviteLinkInput.value = '';
            });

            // 監聽 Firebase 雲端公開清單
            window._latestFirebaseInvites = {};
            if (typeof database !== 'undefined') {
                database.ref('shared_invites').on('value', snap => {
                    window._latestFirebaseInvites = snap.val() || {};
                    renderAllInvites();
                });
            }
            
            // 初次渲染私有清單
            renderAllInvites();
        }

        function log(msg, type = '') {
            if(!logContainer) return;
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            const time = new Date().toLocaleTimeString();
            entry.textContent = \`[\${time}] \${msg}\`;
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

        async function fetchWithRetry(url, options, maxRetries = 3) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const res = await fetch(url, options);
                    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
                    return await res.json();
                } catch (err) {
                    log(\`連線失敗 (\${err.message})，正在重試 (\${i + 1}/\${maxRetries})...\`, 'log-error');
                    await sleep(2000);
                }
            }
            throw new Error('達到最大重試次數，網路連線失敗');
        }

        async function copyToClipboard(text, btnElement) {
            try {
                await navigator.clipboard.writeText(text);
                const originalText = btnElement.innerHTML;
                btnElement.classList.add('success');
                btnElement.innerHTML = \`
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>已複製！</span>
                \`;
                setTimeout(() => {
                    btnElement.classList.remove('success');
                    btnElement.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                log(\`複製失敗: \${err.message}\`, 'log-error');
            }
        }

        async function runAutomation() {
            startBtn.disabled = true;
            startBtn.textContent = "執行中...";
            emailBox.classList.remove('active');
            codeBox.classList.remove('active');
            logContainer.innerHTML = '<div class="log-entry">準備就緒。點擊「開始」以啟動純網頁版自動化流程...</div>';
            
            try {
                log('🚀 開始產生免洗信箱...');
                const domainsRes = await fetchWithRetry('https://api.mail.tm/domains', { method: 'GET' });
                const domain = domainsRes['hydra:member'][0].domain;
                
                const randomString = Date.now().toString();
                const address = \`nintendo\${randomString}@\${domain}\`;
                const password = (pwdInput && pwdInput.value) ? pwdInput.value.trim() : 'Pikmin123!@';
                
                await fetchWithRetry('https://api.mail.tm/accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address, password })
                });
                
                const tokenRes = await fetchWithRetry('https://api.mail.tm/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address, password })
                });
                const token = tokenRes.token;
                
                log('✅ 成功取得信箱！', 'log-success');
                emailDisplay.textContent = address;
                emailBox.classList.add('active');
                copyEmailBtn.onclick = () => copyToClipboard(address, copyEmailBtn);
                
                log('📬 開始監聽任天堂驗證信...');
                codeBox.classList.add('active');
                loadingBar.style.display = 'block';
                codeDisplay.textContent = '--';
                const codeTitle = document.querySelector('#cloud-codeBox .info-title');
                if (codeTitle) codeTitle.textContent = '任天堂驗證碼 (等待中...)';
                copyCodeBtn.disabled = true;
                copyCodeBtn.onclick = null;
                
                let verificationCode = null;
                const maxAttempts = 30;
                
                for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                    log(\`⏳ 等待信件中... (\${attempt}/\${maxAttempts})\`);
                    const msgsRes = await fetchWithRetry('https://api.mail.tm/messages', {
                        method: 'GET',
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    
                    const messages = msgsRes['hydra:member'];
                    if (messages && messages.length > 0) {
                        const mailId = messages[0].id;
                        log('📧 收到信件了！正在讀取內容...');
                        const mailRes = await fetchWithRetry(\`https://api.mail.tm/messages/\${mailId}\`, {
                            method: 'GET',
                            headers: { 'Authorization': \`Bearer \${token}\` }
                        });
                        const htmlContent = mailRes.html[0] || mailRes.text;
                        const match = htmlContent.match(/\\b(\\d{4})\\b/);
                        if (match) {
                            verificationCode = match[1];
                            break;
                        } else {
                            log('⚠️ 信件中沒有找到 4 位數驗證碼', 'log-error');
                        }
                    }
                    await sleep(20000);
                }
                
                if (verificationCode) {
                    log(\`✅ 成功取得驗證碼：\${verificationCode}\`, 'log-success');
                    loadingBar.style.display = 'none';
                    if (codeTitle) codeTitle.textContent = '任天堂驗證碼 (點擊下方複製)';
                    codeDisplay.textContent = verificationCode;
                    copyCodeBtn.disabled = false;
                    copyCodeBtn.onclick = () => copyToClipboard(verificationCode, copyCodeBtn);
                    
                    try {
                        await navigator.clipboard.writeText(verificationCode);
                        log('✅ 驗證碼已自動複製到剪貼簿！');
                    } catch (e) {
                        // ignore
                    }
                } else {
                    log('❌ 等待超時，請重新執行', 'log-error');
                    loadingBar.style.display = 'none';
                    if (codeTitle) codeTitle.textContent = '等待超時';
                }
            } catch (err) {
                log(\`❌ 發生錯誤: \${err.message}\`, 'log-error');
            } finally {
                startBtn.disabled = false;
                startBtn.textContent = "再次產生新信箱";
            }
        }

        if(startBtn) {
            startBtn.addEventListener('click', runAutomation);
        }
    })();

    // ===== Google Maps 邏輯 =====`;

if (oldCloudJsRegex.test(mainJs)) {
    mainJs = mainJs.replace(oldCloudJsRegex, newCloudJs);
    fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
    console.log('[OK] Patched js/main.js with complete cloud logic');
} else {
    console.error('[ERROR] Could not find old cloud JS block in js/main.js');
}

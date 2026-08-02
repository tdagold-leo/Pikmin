const fs = require('fs');

const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let content = fs.readFileSync(jsFile, 'utf-8');

const iifeTargetRegex = /\/\/ ===== 雲端自動註冊小幫手邏輯 =====[\s\S]*?(?=\/\/ ===== Google Maps 邏輯 =====)/;

const newIIFE = `// ===== 雲端自動註冊小幫手邏輯 =====
    (function() {
        const logContainer = document.getElementById('cloud-logContainer');
        const startBtn = document.getElementById('cloud-startBtn');
        const pwdInput = document.getElementById('cloud-password');
        const copyPwdBtn = document.getElementById('cloud-copyPwdBtn');
        const inviteLinkInput = document.getElementById('cloud-inviteLink');
        const inviteNameInput = document.getElementById('cloud-inviteName');
        const openPikminBtn = document.getElementById('cloud-openPikminBtn');
        const saveInviteBtn = document.getElementById('cloud-saveInviteBtn');
        const isPublicCheckbox = document.getElementById('cloud-isPublic');
        const savedLocalLinksList = document.getElementById('cloud-savedLocalLinksList');
        const savedPublicLinksList = document.getElementById('cloud-savedPublicLinksList');
        const autoRotateCheckbox = document.getElementById('cloud-autoRotate');
        const resetAllCountsBtn = document.getElementById('cloud-resetAllCountsBtn');

        const emailBox = document.getElementById('cloud-emailBox');
        const emailDisplay = document.getElementById('cloud-emailDisplay');
        const copyEmailBtn = document.getElementById('cloud-copyEmailBtn');

        const codeBox = document.getElementById('cloud-codeBox');
        const codeDisplay = document.getElementById('cloud-codeDisplay');
        const copyCodeBtn = document.getElementById('cloud-copyCodeBtn');
        const loadingBar = document.getElementById('cloud-loadingBar');
        const codeReminder = document.getElementById('cloud-codeReminder');

        let currentActiveInvite = null;

        function log(message, type = 'log-info') {
            if (!logContainer) return;
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            const time = new Date().toLocaleTimeString('zh-TW', { hour12: false });
            entry.textContent = \`[\${time}] \${message}\`;
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function fetchWithRetry(url, options = {}, retries = 3, delay = 2000) {
            for (let i = 0; i < retries; i++) {
                try {
                    const res = await fetch(url, options);
                    if (!res.ok) {
                        const errBody = await res.text();
                        throw new Error(\`HTTP \${res.status}: \${errBody}\`);
                    }
                    return await res.json();
                } catch (err) {
                    if (i === retries - 1) throw err;
                    await sleep(delay);
                }
            }
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

        // 綁定複製密碼按鈕 (複製並開啟 Pikmin)
        if (copyPwdBtn && pwdInput) {
            copyPwdBtn.addEventListener('click', function() {
                copyToClipboard(pwdInput.value.trim(), this);
                if (openPikminBtn) {
                    window.location.href = openPikminBtn.href;
                }
            });
        }

        // 綁定自訂邀請連結
        if (inviteLinkInput && openPikminBtn) {
            inviteLinkInput.addEventListener('input', function() {
                const val = this.value.trim();
                openPikminBtn.href = val || 'https://pikminbloom.onelink.me/pWSt/73s4bj4n';
            });
        }

        // ===== 邀請連結管理邏輯 (Firebase 公開清單 & LocalStorage 私有清單 + 自動輪替與計數) =====
        function getLocalInvites() {
            try {
                return JSON.parse(localStorage.getItem('pikmin_local_invites') || '{}');
            } catch(e) { return {}; }
        }
        function setLocalInvites(data) {
            localStorage.setItem('pikmin_local_invites', JSON.stringify(data));
        }

        function selectInvite(item, flash = true) {
            currentActiveInvite = item;
            if (inviteNameInput) {
                inviteNameInput.value = item.name;
                if (flash) inviteNameInput.style.border = '2px solid #10b981';
            }
            if (inviteLinkInput) {
                inviteLinkInput.value = item.link;
                if (flash) inviteLinkInput.style.border = '2px solid #10b981';
            }
            if (openPikminBtn) {
                openPikminBtn.href = item.link;
            }
            if (flash) {
                setTimeout(() => {
                    if (inviteLinkInput) inviteLinkInput.style.border = '';
                    if (inviteNameInput) inviteNameInput.style.border = '';
                }, 1000);
            }
        }

        function updateItemCount(item, delta) {
            let newCount = (item.count || 0) + delta;
            if (newCount < 0) newCount = 0;
            
            if (item.isLocal) {
                const data = getLocalInvites();
                if (data[item.id]) {
                    data[item.id].count = newCount;
                    setLocalInvites(data);
                    renderAllInvites();
                }
            } else if (typeof database !== 'undefined') {
                database.ref('shared_invites/' + item.id).update({ count: newCount });
            }
        }

        function resetItemCount(item) {
            if (confirm(\`確定要將「\${item.name}」的執行次數重置為 0 嗎？\`)) {
                if (item.isLocal) {
                    const data = getLocalInvites();
                    if (data[item.id]) {
                        data[item.id].count = 0;
                        setLocalInvites(data);
                        renderAllInvites();
                    }
                } else if (typeof database !== 'undefined') {
                    database.ref('shared_invites/' + item.id).update({ count: 0 });
                }
            }
        }

        function createListElement(item) {
            const el = document.createElement('div');
            el.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); transition: background 0.2s;';
            
            const count = item.count || 0;
            const target = item.target || 20;
            const isDone = count >= target;

            const leftDiv = document.createElement('div');
            leftDiv.style.cssText = 'flex: 1; cursor: pointer; overflow: hidden; margin-right: 8px;';
            const icon = item.isLocal ? '🔒 ' : '🌐 ';
            
            const badgeHtml = isDone 
                ? \`<span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: bold; border: 1px solid rgba(52, 211, 153, 0.4);">✓ 達標 \${count}/\${target}</span>\`
                : \`<span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.3);">\${count}/\${target} 次</span>\`;

            leftDiv.innerHTML = \`
                <div style="font-weight: bold; font-size: 13px; color: #f8fafc; display: flex; align-items: center; flex-wrap: wrap;">
                    <span>\${icon}\${escapeHtml(item.name)}</span>
                    \${badgeHtml}
                </div>
                <div style="font-size: 11px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px;">\${escapeHtml(item.link)}</div>
            \`;
            leftDiv.onclick = () => selectInvite(item, true);

            const rightDiv = document.createElement('div');
            rightDiv.style.cssText = 'display: flex; gap: 4px; align-items: center; flex-shrink: 0;';

            // +1 按鈕
            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.innerHTML = '+1';
            plusBtn.title = '增加 1 次';
            plusBtn.style.cssText = 'background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); border-radius: 4px; cursor: pointer; padding: 2px 6px; font-size: 11px; font-weight: bold;';
            plusBtn.onclick = (e) => { e.stopPropagation(); updateItemCount(item, 1); };

            // -1 按鈕
            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.innerHTML = '-1';
            minusBtn.title = '減少 1 次';
            minusBtn.style.cssText = 'background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; padding: 2px 5px; font-size: 11px; font-weight: bold;';
            minusBtn.onclick = (e) => { e.stopPropagation(); updateItemCount(item, -1); };

            // 🔄 重置單一按鈕
            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.innerHTML = '🔄';
            resetBtn.title = '次數歸零';
            resetBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 2px 4px; font-size: 12px; opacity: 0.7;';
            resetBtn.onclick = (e) => { e.stopPropagation(); resetItemCount(item); };

            // ✏️ 編輯按鈕
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.innerHTML = '✏️';
            editBtn.title = '修改名稱或目標上限';
            editBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 2px 4px; font-size: 12px;';
            editBtn.onclick = (e) => {
                e.stopPropagation();
                const newName = prompt('修改名稱：', item.name);
                if (newName && newName.trim()) {
                    const newTargetStr = prompt('修改目標次數 (預設 20)：', item.target || 20);
                    const newTarget = parseInt(newTargetStr, 10) || 20;
                    if (item.isLocal) {
                        const data = getLocalInvites();
                        if (data[item.id]) {
                            data[item.id].name = newName.trim();
                            data[item.id].target = newTarget;
                        }
                        setLocalInvites(data);
                        renderAllInvites();
                    } else if (typeof database !== 'undefined') {
                        database.ref('shared_invites/' + item.id).update({
                            name: newName.trim(),
                            target: newTarget
                        });
                    }
                }
            };

            // 🗑️ 刪除按鈕
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.innerHTML = '🗑️';
            delBtn.title = '刪除連結';
            delBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 2px 4px; font-size: 12px;';
            delBtn.onclick = (e) => {
                e.stopPropagation();
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

            rightDiv.appendChild(plusBtn);
            rightDiv.appendChild(minusBtn);
            rightDiv.appendChild(resetBtn);
            rightDiv.appendChild(editBtn);
            rightDiv.appendChild(delBtn);
            
            el.appendChild(leftDiv);
            el.appendChild(rightDiv);
            return el;
        }

        function getAllInviteEntries() {
            const localData = getLocalInvites();
            let entries = Object.keys(localData).map(key => ({ id: key, isLocal: true, ...localData[key] }));
            if (window._latestFirebaseInvites) {
                const fbData = window._latestFirebaseInvites;
                entries = entries.concat(Object.keys(fbData).map(key => ({ id: key, isLocal: false, ...fbData[key] })));
            }
            entries.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
            return entries;
        }

        function renderAllInvites() {
            if (!savedLocalLinksList || !savedPublicLinksList) return;
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

            // If no active invite selected yet, select the first pending one
            if (!currentActiveInvite || (inviteLinkInput && !inviteLinkInput.value.trim())) {
                const all = getAllInviteEntries();
                const nextAvailable = all.find(i => (i.count || 0) < (i.target || 20)) || all[0];
                if (nextAvailable) {
                    selectInvite(nextAvailable, false);
                }
            }
        }

        // 自動輪替至下一位邀請人
        window.rotateToNextInvite = function() {
            const all = getAllInviteEntries();
            if (all.length === 0) return;

            // 1. 如果有當前選取的對象，幫他 +1
            const currentLink = inviteLinkInput ? inviteLinkInput.value.trim() : '';
            let activeItem = all.find(i => i.link === currentLink || (currentActiveInvite && i.id === currentActiveInvite.id));
            
            if (activeItem) {
                updateItemCount(activeItem, 1);
            }

            // 2. 尋找下一位未達標的名單
            const pendingList = all.filter(i => (i.count || 0) < (i.target || 20));
            if (pendingList.length > 0) {
                let nextItem = pendingList.find(i => !activeItem || i.id !== activeItem.id);
                if (!nextItem) nextItem = pendingList[0];
                
                selectInvite(nextItem, true);
                log(\`🔄 自動輪替邀請人：\${nextItem.name} (\${(nextItem.count || 0)}/\${(nextItem.target || 20)}次)\`, 'log-success');
            } else {
                log('🎉 所有名單皆已達標（滿額）！', 'log-success');
            }
        };

        // 重置全部名單次數
        if (resetAllCountsBtn) {
            resetAllCountsBtn.addEventListener('click', () => {
                if (confirm('確定要將「所有名單 (公開與私有)」的執行次數全部歸零重置嗎？')) {
                    // Reset local
                    const localData = getLocalInvites();
                    Object.keys(localData).forEach(k => localData[k].count = 0);
                    setLocalInvites(localData);

                    // Reset public
                    if (typeof database !== 'undefined') {
                        database.ref('shared_invites').once('value', snap => {
                            const fbData = snap.val() || {};
                            const updates = {};
                            Object.keys(fbData).forEach(k => {
                                updates['shared_invites/' + k + '/count'] = 0;
                            });
                            database.ref().update(updates);
                        });
                    }
                    renderAllInvites();
                    alert('✅ 所有名單次數已全數歸零！');
                }
            });
        }

        // Save logic
        if (saveInviteBtn && inviteLinkInput) {
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
                    count: 0,
                    target: 20,
                    createdAt: Date.now()
                };

                if (isPublic) {
                    if (typeof database !== 'undefined') {
                        database.ref('shared_invites').push(newObj);
                    }
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
        }

        // Listen to Firebase
        window._latestFirebaseInvites = {};
        if (typeof database !== 'undefined') {
            database.ref('shared_invites').on('value', snap => {
                window._latestFirebaseInvites = snap.val() || {};
                renderAllInvites();
            });
        }
        
        // Initial render
        renderAllInvites();

        // ===== 執行自動化核心函式 =====
        async function runAutomation() {
            if (!startBtn) return;
            startBtn.disabled = true;
            startBtn.textContent = "執行中...";
            if (emailBox) emailBox.classList.remove('active');
            if (codeBox) codeBox.classList.remove('active');
            if (logContainer) logContainer.innerHTML = '<div class="log-entry">準備就緒。點擊「開始」以啟動純網頁版自動化流程...</div>';
            
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
                if (emailDisplay) emailDisplay.textContent = address;
                if (emailBox) emailBox.classList.add('active');
                if (copyEmailBtn) {
                    copyEmailBtn.onclick = () => {
                        copyToClipboard(address, copyEmailBtn);
                        if (openPikminBtn) {
                            window.location.href = openPikminBtn.href;
                        }
                    };
                }
                
                log('📬 開始監聽任天堂驗證信...');
                if (codeBox) codeBox.classList.add('active');
                if (loadingBar) loadingBar.style.display = 'block';
                if (codeDisplay) codeDisplay.textContent = '--';
                if (codeReminder) codeReminder.style.display = 'none';
                
                const codeTitle = document.querySelector('#cloud-codeBox .info-title');
                if (codeTitle) codeTitle.textContent = '步驟 3：任天堂驗證碼 (等待信件中...)';
                if (copyCodeBtn) {
                    copyCodeBtn.disabled = true;
                    copyCodeBtn.classList.remove('code-ready');
                    copyCodeBtn.onclick = null;
                }
                
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
                    if (loadingBar) loadingBar.style.display = 'none';
                    if (codeTitle) codeTitle.textContent = '步驟 3：任天堂驗證碼 (已送達！)';
                    if (codeReminder) codeReminder.style.display = 'flex';
                    if (codeDisplay) codeDisplay.textContent = verificationCode;
                    if (copyCodeBtn) {
                        copyCodeBtn.disabled = false;
                        copyCodeBtn.classList.add('code-ready');
                        copyCodeBtn.onclick = () => {
                            copyToClipboard(verificationCode, copyCodeBtn);
                            if (openPikminBtn) {
                                window.location.href = openPikminBtn.href;
                            }
                        };
                    }
                    
                    if (navigator.vibrate) {
                        try { navigator.vibrate([100, 50, 100]); } catch(e) {}
                    }

                    // 自動輪替邀請人（並將當前使用者計數 +1）
                    if (autoRotateCheckbox && autoRotateCheckbox.checked && typeof window.rotateToNextInvite === 'function') {
                        window.rotateToNextInvite();
                    }
                    
                    try {
                        await navigator.clipboard.writeText(verificationCode);
                        log('✅ 驗證碼已自動複製到剪貼簿！');
                    } catch (e) {
                        // ignore
                    }
                } else {
                    log('❌ 等待超時，請重新執行', 'log-error');
                    if (loadingBar) loadingBar.style.display = 'none';
                    if (codeTitle) codeTitle.textContent = '等待超時';
                }
            } catch (err) {
                log(\`❌ 發生錯誤: \${err.message}\`, 'log-error');
            } finally {
                startBtn.disabled = false;
                startBtn.textContent = "再次產生新信箱";
            }
        }

        if (startBtn) {
            startBtn.addEventListener('click', runAutomation);
        }
    })();
    \n`;

content = content.replace(iifeTargetRegex, newIIFE);
fs.writeFileSync(jsFile, content, 'utf-8');
console.log('Successfully rebuilt cloud IIFE with full automation, auto-rotate, and counter features!');

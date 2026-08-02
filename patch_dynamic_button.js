const fs = require('fs');

// 1. Update index.html
const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const heroTargetRegex = /<!-- 頂部極致 1-Click 快捷主按鈕 -->[\s\S]*?<\/div>\s*<\/div>/;

const newHeroHtml = `<!-- 動態引導單一主按鈕 Hero 區塊 -->
                    <div class="dynamic-hero-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; padding: 20px; margin-bottom: 25px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); text-align: center;">
                        
                        <!-- 當前邀請對象資訊 -->
                        <div id="cloud-currentInviterBadge" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); padding: 5px 14px; border-radius: 20px; font-size: 13px; color: #38bdf8; margin-bottom: 15px;">
                            <span>🎯 目標邀請人：<strong id="cloud-activeInviterName">載入中...</strong></span>
                            <span id="cloud-activeInviterCount" style="font-weight: bold; background: rgba(56, 189, 248, 0.25); padding: 2px 8px; border-radius: 6px; font-size: 11px;">0/4 次</span>
                        </div>

                        <!-- 動態引導主按鈕 -->
                        <button id="cloud-dynamicActionBtn" class="dynamic-action-btn state-ready" style="width: 100%; padding: 18px 20px; border-radius: 14px; font-size: 17px; font-weight: 800; border: 1px solid rgba(255,255,255,0.25); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.45); color: white;">
                            <div class="btn-main-label" style="display: flex; align-items: center; gap: 8px;">
                                <span id="cloud-dynamicBtnIcon" style="font-size: 20px;">🚀</span>
                                <span id="cloud-dynamicBtnText">第 1 步：產生免洗帳號並出發</span>
                            </div>
                            <div id="cloud-dynamicBtnSub" style="font-size: 12px; opacity: 0.88; font-weight: 500;">
                                自動複製信箱 ➜ 自動輪替名單 ➜ 開啟 Pikmin
                            </div>
                        </button>

                        <!-- 底部快捷列 -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 12px; padding: 0 4px;">
                            <a id="cloud-openPikminBtn" href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" style="color: #10b981; text-decoration: none; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                                🍄 手動開啟 Pikmin
                            </a>
                            <button id="cloud-enableNotifBtn" type="button" style="background: none; border: none; color: #38bdf8; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0; font-weight: 500;">
                                🔔 開啟手機通知推播
                            </button>
                        </div>
                    </div>`;

indexContent = indexContent.replace(heroTargetRegex, newHeroHtml);

// Add CSS styling for dynamic buttons if not already present
if (!indexContent.includes('.dynamic-action-btn.state-waiting')) {
    const cssToAdd = `
        .dynamic-action-btn.state-ready {
            background: linear-gradient(135deg, #0284c7, #2563eb) !important;
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.45) !important;
        }
        .dynamic-action-btn.state-ready:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(37, 99, 235, 0.6) !important;
        }
        .dynamic-action-btn.state-generating {
            background: linear-gradient(135deg, #475569, #334155) !important;
            cursor: wait !important;
        }
        .dynamic-action-btn.state-waiting {
            background: linear-gradient(135deg, #d97706, #b45309) !important;
            animation: actionWaitingPulse 2s infinite !important;
            box-shadow: 0 4px 20px rgba(217, 119, 6, 0.45) !important;
        }
        @keyframes actionWaitingPulse {
            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            70% { box-shadow: 0 0 0 14px rgba(245, 158, 11, 0); }
            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        .dynamic-action-btn.state-code-ready {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            animation: actionCodeReadyPulse 1.2s infinite !important;
            box-shadow: 0 4px 25px rgba(16, 185, 129, 0.7) !important;
        }
        @keyframes actionCodeReadyPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.8); }
            50% { transform: scale(1.02); box-shadow: 0 0 0 16px rgba(52, 211, 153, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }
        .dynamic-action-btn.state-completed {
            background: linear-gradient(135deg, #8b5cf6, #6d28d9) !important;
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.45) !important;
        }
    `;
    indexContent = indexContent.replace('</style>', cssToAdd + '\n</style>');
}

fs.writeFileSync(indexFile, indexContent, 'utf-8');
console.log('index.html updated with dynamic hero action button structure and styles.');

// 2. Update js/main.js
const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let content = fs.readFileSync(jsFile, 'utf-8');

const iifeTargetRegex = /\/\/ ===== 雲端自動註冊小幫手邏輯 =====[\s\S]*?(?=\/\/ ===== Google Maps 邏輯 =====)/;

const newIIFE = `// ===== 雲端自動註冊小幫手邏輯 =====
    (function() {
        const logContainer = document.getElementById('cloud-logContainer');
        const dynamicActionBtn = document.getElementById('cloud-dynamicActionBtn');
        const dynamicBtnIcon = document.getElementById('cloud-dynamicBtnIcon');
        const dynamicBtnText = document.getElementById('cloud-dynamicBtnText');
        const dynamicBtnSub = document.getElementById('cloud-dynamicBtnSub');
        const activeInviterName = document.getElementById('cloud-activeInviterName');
        const activeInviterCount = document.getElementById('cloud-activeInviterCount');

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
        const enableNotifBtn = document.getElementById('cloud-enableNotifBtn');

        const emailBox = document.getElementById('cloud-emailBox');
        const emailDisplay = document.getElementById('cloud-emailDisplay');
        const copyEmailBtn = document.getElementById('cloud-copyEmailBtn');

        const codeBox = document.getElementById('cloud-codeBox');
        const codeDisplay = document.getElementById('cloud-codeDisplay');
        const copyCodeBtn = document.getElementById('cloud-copyCodeBtn');
        const loadingBar = document.getElementById('cloud-loadingBar');
        const codeReminder = document.getElementById('cloud-codeReminder');

        let currentActiveInvite = null;
        let latestReceivedCode = null;
        let currentGeneratedEmail = null;
        let currentState = 'ready'; // 'ready' | 'generating' | 'waiting' | 'code_ready' | 'completed'

        // ===== 動態引導單一按鈕狀態管理 =====
        function setActionState(state, data = {}) {
            currentState = state;
            if (!dynamicActionBtn) return;

            dynamicActionBtn.className = 'dynamic-action-btn state-' + state;

            if (state === 'ready') {
                if (dynamicBtnIcon) dynamicBtnIcon.textContent = '🚀';
                if (dynamicBtnText) dynamicBtnText.textContent = '第 1 步：產生免洗帳號並出發';
                if (dynamicBtnSub) dynamicBtnSub.textContent = '自動複製信箱 ➜ 自動輪替名單 ➜ 開啟 Pikmin';
                dynamicActionBtn.disabled = false;
            } else if (state === 'generating') {
                if (dynamicBtnIcon) dynamicBtnIcon.textContent = '⏳';
                if (dynamicBtnText) dynamicBtnText.textContent = '正在建立免洗信箱...';
                if (dynamicBtnSub) dynamicBtnSub.textContent = '請稍候，即將自動複製並跳轉至遊戲';
                dynamicActionBtn.disabled = true;
            } else if (state === 'waiting') {
                if (dynamicBtnIcon) dynamicBtnIcon.textContent = '📬';
                if (dynamicBtnText) dynamicBtnText.textContent = '等待驗證信中... (點此重開遊戲)';
                if (dynamicBtnSub) dynamicBtnSub.textContent = '信箱已在剪貼簿！請在遊戲貼上並發送驗證碼';
                dynamicActionBtn.disabled = false;
            } else if (state === 'code_ready') {
                const code = data.code || latestReceivedCode || '----';
                if (dynamicBtnIcon) dynamicBtnIcon.textContent = '🎉';
                if (dynamicBtnText) dynamicBtnText.textContent = \`驗證碼：\${code} (點擊複製並開啟遊戲)\`;
                if (dynamicBtnSub) dynamicBtnSub.textContent = '🔔 驗證碼已自動複製！點此直接跳回 Pikmin 填寫';
                dynamicActionBtn.disabled = false;
            } else if (state === 'completed') {
                if (dynamicBtnIcon) dynamicBtnIcon.textContent = '✨';
                if (dynamicBtnText) dynamicBtnText.textContent = '完成！點此產生下一隻 (已就緒下一位)';
                if (dynamicBtnSub) dynamicBtnSub.textContent = '當前次數 +1，已自動切換至下一位朋友';
                dynamicActionBtn.disabled = false;
            }
        }

        function updateInviterBadge() {
            if (activeInviterName && activeInviterCount) {
                if (currentActiveInvite) {
                    const icon = currentActiveInvite.isLocal ? '🔒 ' : '🌐 ';
                    activeInviterName.textContent = icon + currentActiveInvite.name;
                    const c = currentActiveInvite.count || 0;
                    const t = currentActiveInvite.target || 4;
                    activeInviterCount.textContent = \`\${c}/\${t} 次\`;
                    if (c >= t) {
                        activeInviterCount.style.background = 'rgba(16, 185, 129, 0.3)';
                        activeInviterCount.style.color = '#34d399';
                    } else {
                        activeInviterCount.style.background = 'rgba(56, 189, 248, 0.25)';
                        activeInviterCount.style.color = '#38bdf8';
                    }
                } else {
                    activeInviterName.textContent = '預設連結';
                    activeInviterCount.textContent = '0/4 次';
                }
            }
        }

        // 請求通知權限
        function requestNotificationPermission() {
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        log('🔔 已啟用手機通知推播！驗證碼送達時將直接彈出於螢幕頂部。', 'log-success');
                        if (enableNotifBtn) enableNotifBtn.textContent = '🔔 通知已開啟';
                    }
                });
            }
        }
        if (enableNotifBtn) {
            if ('Notification' in window && Notification.permission === 'granted') {
                enableNotifBtn.textContent = '🔔 通知已開啟';
            }
            enableNotifBtn.addEventListener('click', requestNotificationPermission);
        }

        // 清脆雙音提示 (Web Audio API 合成音，不需任何外部音效檔)
        function playCodeChime() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const ctx = new AudioContext();
                const now = ctx.currentTime;
                
                // 第一聲 G5
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(783.99, now);
                gain1.gain.setValueAtTime(0.3, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.3);

                // 第二聲 C6
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(1046.50, now + 0.15);
                gain2.gain.setValueAtTime(0.4, now + 0.15);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start(now + 0.15);
                osc2.stop(now + 0.6);
            } catch(e) {}
        }

        // 手機/電腦系統通知推播
        function pushCodeNotification(code) {
            if ('Notification' in window && Notification.permission === 'granted') {
                try {
                    const notif = new Notification('🍄 Pikmin 驗證碼：' + code, {
                        body: '點擊複製驗證碼並返回 Pikmin 遊戲！',
                        icon: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
                        badge: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
                        tag: 'pikmin-code-tag',
                        renotify: true,
                        requireInteraction: true
                    });
                    notif.onclick = function() {
                        window.focus();
                        navigator.clipboard.writeText(code);
                        if (openPikminBtn) window.location.href = openPikminBtn.href;
                    };
                } catch(e) {}
            }
        }

        // 切回焦點時自動複製驗證碼 (Auto-Copy on Focus)
        function handleAutoCopyOnFocus() {
            if (latestReceivedCode) {
                navigator.clipboard.writeText(latestReceivedCode).then(() => {
                    log(\`📋 已自動將驗證碼 \${latestReceivedCode} 寫入剪貼簿！\`, 'log-success');
                }).catch(() => {});
            }
        }
        window.addEventListener('focus', handleAutoCopyOnFocus);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                handleAutoCopyOnFocus();
            }
        });

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
                if (btnElement) {
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
                }
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
            updateInviterBadge();

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
            const target = item.target || 4;
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
                    const newTargetStr = prompt('修改目標次數 (預設 4)：', item.target || 4);
                    const newTarget = parseInt(newTargetStr, 10) || 4;
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
                const nextAvailable = all.find(i => (i.count || 0) < (i.target || 4)) || all[0];
                if (nextAvailable) {
                    selectInvite(nextAvailable, false);
                }
            } else {
                updateInviterBadge();
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

            // 2. 尋找下一位未達標的名單 (目標預設 4)
            const pendingList = all.filter(i => (i.count || 0) < (i.target || 4));
            if (pendingList.length > 0) {
                let nextItem = pendingList.find(i => !activeItem || i.id !== activeItem.id);
                if (!nextItem) nextItem = pendingList[0];
                
                selectInvite(nextItem, true);
                log(\`🔄 自動輪替邀請人：\${nextItem.name} (\${(nextItem.count || 0)}/\${(nextItem.target || 4)}次)\`, 'log-success');
            } else {
                log('🎉 所有名單皆已達標（滿 4 次）！', 'log-success');
            }
            updateInviterBadge();
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
                    target: 4,
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
            requestNotificationPermission();
            setActionState('generating');

            if (emailBox) emailBox.classList.remove('active');
            if (codeBox) codeBox.classList.remove('active');
            latestReceivedCode = null;
            if (logContainer) logContainer.innerHTML = '<div class="log-entry">準備就緒。正在建立信箱並準備跳轉...</div>';
            
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
                
                currentGeneratedEmail = address;
                log('✅ 成功取得信箱！', 'log-success');
                if (emailDisplay) emailDisplay.textContent = address;
                if (emailBox) emailBox.classList.add('active');
                
                // 自動複製信箱到剪貼簿
                try {
                    await navigator.clipboard.writeText(address);
                    log('📋 已自動將信箱複製到剪貼簿！', 'log-success');
                } catch(e) {}

                if (copyEmailBtn) {
                    copyEmailBtn.onclick = () => {
                        copyToClipboard(address, copyEmailBtn);
                        if (openPikminBtn) {
                            window.location.href = openPikminBtn.href;
                        }
                    };
                }

                // 🚀 自動跳轉至 Pikmin Bloom 遊戲
                if (openPikminBtn && openPikminBtn.href) {
                    log('🍄 自動開啟 Pikmin Bloom 遊戲...', 'log-info');
                    window.location.href = openPikminBtn.href;
                }

                // 切換動態按鈕至「等待信件中」狀態
                setActionState('waiting');
                
                log('📬 後台開始監聽任天堂驗證信 (收到將自動推播通知)...');
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
                    latestReceivedCode = verificationCode;
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
                    
                    // 🔔 1. 播放清脆提示音
                    playCodeChime();

                    // 📱 2. 手機震動
                    if (navigator.vibrate) {
                        try { navigator.vibrate([200, 100, 200, 100, 200]); } catch(e) {}
                    }

                    // 📢 3. 手機/電腦系統通知推播 (直接顯示 4 位數驗證碼)
                    pushCodeNotification(verificationCode);

                    // 🔄 4. 自動輪替邀請人（並將當前使用者計數 +1）
                    if (autoRotateCheckbox && autoRotateCheckbox.checked && typeof window.rotateToNextInvite === 'function') {
                        window.rotateToNextInvite();
                    }

                    // 🌟 5. 更新動態單一主按鈕至「驗證碼送達 (Code Ready)」狀態
                    setActionState('code_ready', { code: verificationCode });
                    
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
                    setActionState('ready');
                }
            } catch (err) {
                log(\`❌ 發生錯誤: \${err.message}\`, 'log-error');
                setActionState('ready');
            }
        }

        // ===== 綁定動態引導按鈕點擊事件 =====
        if (dynamicActionBtn) {
            dynamicActionBtn.addEventListener('click', () => {
                if (currentState === 'ready' || currentState === 'completed') {
                    runAutomation();
                } else if (currentState === 'waiting') {
                    // 如果在等待中點擊，再次複製信箱並嘗試手動跳轉回 Pikmin
                    if (currentGeneratedEmail) {
                        navigator.clipboard.writeText(currentGeneratedEmail);
                        log('📋 已再次複製信箱到剪貼簿！');
                    }
                    if (openPikminBtn) window.location.href = openPikminBtn.href;
                } else if (currentState === 'code_ready') {
                    // 複製驗證碼並開啟遊戲，切換到 completed
                    if (latestReceivedCode) {
                        navigator.clipboard.writeText(latestReceivedCode);
                        log(\`📋 已複製驗證碼 \${latestReceivedCode}！\`, 'log-success');
                    }
                    if (openPikminBtn) window.location.href = openPikminBtn.href;
                    setActionState('completed');
                }
            });
        }
    })();
    \n`;

content = content.replace(iifeTargetRegex, newIIFE);
fs.writeFileSync(jsFile, content, 'utf-8');
console.log('Successfully updated main.js with Dynamic Guided Action Button logic!');

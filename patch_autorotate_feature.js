const fs = require('fs');

// 1. Update index.html
const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const htmlTarget = `                    <!-- Pikmin 邀請連結（自訂）與儲存管理 -->
                    <div class="input-group" style="margin-bottom: 0;">
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
                        </div>`;

const htmlReplacement = `                    <!-- Pikmin 邀請連結（自訂）與儲存管理 -->
                    <div class="input-group" style="margin-bottom: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <label for="cloud-inviteLink" style="margin: 0; font-weight: 700;">Pikmin 邀請連結</label>
                                <label style="font-size: 12px; color: #38bdf8; cursor: pointer; display: flex; align-items: center; gap: 4px; background: rgba(56, 189, 248, 0.1); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.25);">
                                    <input type="checkbox" id="cloud-autoRotate" checked style="cursor: pointer;"> 🔄 自動輪替名單
                                </label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <button id="cloud-resetAllCountsBtn" type="button" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; padding: 0;" title="將所有名單的執行次數重置為 0">
                                    🔄 重置全部次數
                                </button>
                                <label style="font-size: 12px; color: #a1a1aa; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                    <input type="checkbox" id="cloud-isPublic" checked style="cursor: pointer;"> 公開
                                </label>
                                <button id="cloud-saveInviteBtn" type="button" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 4px; padding: 0;">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    儲存
                                </button>
                            </div>
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

const regex = /\/\/ ===== 邀請連結管理邏輯 \(Firebase 公開清單 & LocalStorage 私有清單\) =====[\s\S]*?(?=\}\s*\n\s*\/\/ 綁定複製密碼按鈕|\}\)\(\);\s*\n\s*\/\/ ===== Google Maps 邏輯 =====)/;

const newJsBlock = `// ===== 邀請連結管理邏輯 (Firebase 公開清單 & LocalStorage 私有清單 + 自動輪替與計數) =====
        const autoRotateCheckbox = document.getElementById('cloud-autoRotate');
        const resetAllCountsBtn = document.getElementById('cloud-resetAllCountsBtn');
        let currentActiveInvite = null;

        if (inviteLinkInput && openPikminBtn && saveInviteBtn && savedLocalLinksList && savedPublicLinksList) {
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
                inviteLinkInput.value = item.link;
                openPikminBtn.href = item.link;
                if (flash) inviteLinkInput.style.border = '2px solid #10b981';
                if (flash) {
                    setTimeout(() => {
                        inviteLinkInput.style.border = '';
                        if (inviteNameInput) inviteNameInput.style.border = '';
                    }, 1000);
                }
            }

            function updateItemCount(item, delta) {
                const target = item.target || 20;
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
                if (!currentActiveInvite || !inviteLinkInput.value.trim()) {
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
                const currentLink = inviteLinkInput.value.trim();
                let activeItem = all.find(i => i.link === currentLink || (currentActiveInvite && i.id === currentActiveInvite.id));
                
                if (activeItem) {
                    updateItemCount(activeItem, 1);
                }

                // 2. 尋找下一位未達標的名單
                const pendingList = all.filter(i => (i.count || 0) < (i.target || 20));
                if (pendingList.length > 0) {
                    // 找下一個不是 activeItem 的，或者第一個未達標的
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
        }`;

if (regex.test(jsContent)) {
    jsContent = jsContent.replace(regex, newJsBlock);
} else {
    console.log('Regex match failed in main.js');
}

// 3. Connect rotation trigger in runAutomation when verificationCode arrives
const codeSuccessTarget = `                    if (navigator.vibrate) {
                        try { navigator.vibrate([100, 50, 100]); } catch(e) {}
                    }`;

const codeSuccessReplacement = `                    if (navigator.vibrate) {
                        try { navigator.vibrate([100, 50, 100]); } catch(e) {}
                    }
                    if (autoRotateCheckbox && autoRotateCheckbox.checked && typeof window.rotateToNextInvite === 'function') {
                        window.rotateToNextInvite();
                    }`;

if (jsContent.includes(codeSuccessTarget) && !jsContent.includes('window.rotateToNextInvite();')) {
    jsContent = jsContent.replace(codeSuccessTarget, codeSuccessReplacement);
}

fs.writeFileSync(jsFile, jsContent, 'utf-8');
console.log('main.js updated successfully.');

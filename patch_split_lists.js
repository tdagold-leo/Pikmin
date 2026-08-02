const fs = require('fs');

const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const htmlTarget = `<details style="margin-top: 15px;">
                            <summary style="cursor: pointer; font-size: 14px; color: #94a3b8; outline: none; padding: 5px 0; user-select: none; font-weight: bold;">
                                共用清單 (點此展開)
                            </summary>
                            <div id="cloud-savedLinksList" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                            </div>
                        </details>`;

const htmlReplacement = `<details style="margin-top: 15px;">
                            <summary style="cursor: pointer; font-size: 14px; color: #94a3b8; outline: none; padding: 5px 0; user-select: none; font-weight: bold;">
                                🔒 私有清單 (點此展開)
                            </summary>
                            <div id="cloud-savedLocalLinksList" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                            </div>
                        </details>
                        <details style="margin-top: 10px;">
                            <summary style="cursor: pointer; font-size: 14px; color: #94a3b8; outline: none; padding: 5px 0; user-select: none; font-weight: bold;">
                                🌐 公開清單 (點此展開)
                            </summary>
                            <div id="cloud-savedPublicLinksList" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                            </div>
                        </details>`;

if (indexContent.includes(htmlTarget)) {
    indexContent = indexContent.replace(htmlTarget, htmlReplacement);
    fs.writeFileSync(indexFile, indexContent, 'utf-8');
    console.log('index.html updated successfully.');
} else {
    console.log('Target string not found in index.html');
}

const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

// I need to replace the entire `renderAllInvites` logic and elements logic.
// Let's replace from `const savedLinksList = document.getElementById('cloud-savedLinksList');` 
// up to the end of `renderAllInvites(); }`.
// It's safer to use a regex that captures the entire JS block.

const regex = /\/\/ ===== Shared Invites Logic \(Firebase & Local\) =====[\s\S]*?(?=\}\s*\n\s*\/\/ --- END ---|\}\s*\n\s*\}\)\(\);)/;

const newJsBlock = `// ===== Shared Invites Logic (Firebase & Local) =====
        const saveInviteBtn = document.getElementById('cloud-saveInviteBtn');
        const savedLocalLinksList = document.getElementById('cloud-savedLocalLinksList');
        const savedPublicLinksList = document.getElementById('cloud-savedPublicLinksList');
        const isPublicCheckbox = document.getElementById('cloud-isPublic');
        const inviteLinkInput = document.getElementById('cloud-inviteLink');
        const inviteNameInput = document.getElementById('cloud-inviteName');
        const openPikminBtn = document.getElementById('cloud-openPikminBtn');

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
                el.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px;';
                
                const leftDiv = document.createElement('div');
                leftDiv.style.cssText = 'flex: 1; cursor: pointer; overflow: hidden;';
                const icon = item.isLocal ? '🔒 ' : '🌐 ';
                leftDiv.innerHTML = \`
                    <div style="font-weight: bold; font-size: 14px; color: #fff;">\${icon}\${item.name}</div>
                    <div style="font-size: 12px; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${item.link}</div>
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
                rightDiv.style.cssText = 'display: flex; gap: 10px; margin-left: 10px;';

                const editBtn = document.createElement('button');
                editBtn.innerHTML = '✏️';
                editBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0; font-size: 14px; color: #fff;';
                editBtn.onclick = () => {
                    const newName = prompt('修改名稱：', item.name);
                    if (newName && newName !== item.name) {
                        if (item.isLocal) {
                            const data = getLocalInvites();
                            if(data[item.id]) data[item.id].name = newName;
                            setLocalInvites(data);
                            renderAllInvites();
                        } else {
                            database.ref('shared_invites/' + item.id).update({ name: newName });
                        }
                    }
                };

                const delBtn = document.createElement('button');
                delBtn.innerHTML = '🗑️';
                delBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0; font-size: 14px; color: #fff;';
                delBtn.onclick = () => {
                    if (confirm(\`確定要刪除「\${item.name}」的連結嗎？\`)) {
                        if (item.isLocal) {
                            const data = getLocalInvites();
                            delete data[item.id];
                            setLocalInvites(data);
                            renderAllInvites();
                        } else {
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
                    savedLocalLinksList.innerHTML = '<div style="font-size:12px; color:#666; text-align:center;">目前沒有私有連結</div>';
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
                    savedPublicLinksList.innerHTML = '<div style="font-size:12px; color:#666; text-align:center;">目前沒有公開連結</div>';
                } else {
                    publicEntries.forEach(item => savedPublicLinksList.appendChild(createListElement(item)));
                }
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
                    createdAt: Date.now()
                };

                if (isPublic) {
                    database.ref('shared_invites').push(newObj);
                } else {
                    const localData = getLocalInvites();
                    const newId = 'local_' + Date.now() + '_' + Math.floor(Math.random()*1000);
                    localData[newId] = newObj;
                    setLocalInvites(localData);
                    renderAllInvites();
                }

                if(inviteNameInput) inviteNameInput.value = '';
                inviteLinkInput.value = '';
            });

            // Listen to Firebase
            window._latestFirebaseInvites = {};
            database.ref('shared_invites').on('value', snap => {
                window._latestFirebaseInvites = snap.val() || {};
                renderAllInvites();
            });
            
            // Initial render for local data (in case firebase is slow)
            renderAllInvites();
        }`;

if (regex.test(jsContent)) {
    jsContent = jsContent.replace(regex, newJsBlock);
    fs.writeFileSync(jsFile, jsContent, 'utf-8');
    console.log('main.js updated successfully.');
} else {
    console.log('Target string not found in main.js');
}

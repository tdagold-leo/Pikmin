const fs = require('fs');

const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const htmlTarget = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label for="cloud-inviteLink" style="margin: 0;">Pikmin 邀請連結 (自訂)</label>
                            <button id="cloud-saveInviteBtn" style="background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 4px; padding: 0;">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                儲存目前連結
                            </button>
                        </div>`;

const htmlReplacement = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label for="cloud-inviteLink" style="margin: 0;">Pikmin 邀請連結 (自訂)</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <label style="font-size: 13px; color: #a1a1aa; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                    <input type="checkbox" id="cloud-isPublic" checked style="cursor: pointer;"> 公開
                                </label>
                                <button id="cloud-saveInviteBtn" style="background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 4px; padding: 0;">
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
    console.log('Target string not found in index.html');
}


const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const jsTargetStart = `// ===== Shared Invites Logic (Firebase) =====`;
const jsTargetEnd = `        }

        // --- END ---`; // I will replace using regex or simple substring since I know the block.

// The easiest way is to use regex or string replace for the whole block from 3645 to the end of the IIFE.
// Let's do string replacement from the start marker to the closing bracket of `if (inviteLinkInput ...)`

const regex = /\/\/ ===== Shared Invites Logic \(Firebase\) =====[\s\S]*?(?=\}\s*\)\(\);)/;

const newJsBlock = `// ===== Shared Invites Logic (Firebase & Local) =====
        const saveInviteBtn = document.getElementById('cloud-saveInviteBtn');
        const savedLinksList = document.getElementById('cloud-savedLinksList');
        const isPublicCheckbox = document.getElementById('cloud-isPublic');

        if (inviteLinkInput && openPikminBtn && saveInviteBtn && savedLinksList) {
            
            function getLocalInvites() {
                try {
                    return JSON.parse(localStorage.getItem('pikmin_local_invites') || '{}');
                } catch(e) { return {}; }
            }
            function setLocalInvites(data) {
                localStorage.setItem('pikmin_local_invites', JSON.stringify(data));
            }
            function renderAllInvites() {
                savedLinksList.innerHTML = '';
                
                // Fetch local
                const localData = getLocalInvites();
                let entries = Object.keys(localData).map(key => ({ id: key, isLocal: true, ...localData[key] }));

                // Firebase data is fetched in real-time, but we need to combine it.
                // We will store the latest firebase snapshot data in a higher scope variable
                if (window._latestFirebaseInvites) {
                    const fbData = window._latestFirebaseInvites;
                    entries = entries.concat(Object.keys(fbData).map(key => ({ id: key, isLocal: false, ...fbData[key] })));
                }

                entries.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

                entries.forEach(item => {
                    const el = document.createElement('div');
                    el.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px;';
                    
                    const leftDiv = document.createElement('div');
                    leftDiv.style.cssText = 'flex: 1; cursor: pointer; overflow: hidden;';
                    const icon = item.isLocal ? '🔒 ' : '';
                    leftDiv.innerHTML = \`
                        <div style="font-weight: bold; font-size: 14px; color: #fff;">\${icon}\${item.name}</div>
                        <div style="font-size: 12px; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${item.link}</div>
                    \`;
                    leftDiv.onclick = () => {
                        const inviteNameInput = document.getElementById('cloud-inviteName');
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
                    savedLinksList.appendChild(el);
                });
            }

            // Save logic
            const inviteNameInput = document.getElementById('cloud-inviteName');
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
        }
`;

if (regex.test(jsContent)) {
    jsContent = jsContent.replace(regex, newJsBlock);
    fs.writeFileSync(jsFile, jsContent, 'utf-8');
    console.log('main.js updated successfully.');
} else {
    console.log('Target string not found in main.js');
}

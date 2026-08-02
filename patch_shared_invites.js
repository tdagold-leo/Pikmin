const fs = require('fs');

const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const linkTarget = `                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-inviteLink">Pikmin 邀請連結 (自訂)</label>
                        <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="width: 100%; border-radius: 8px; padding: 10px 15px; box-sizing: border-box; font-size: 14px;">
                    </div>`;

const linkReplacement = `                    <div class="input-group" style="margin-bottom: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label for="cloud-inviteLink" style="margin: 0;">Pikmin 邀請連結 (自訂)</label>
                            <button id="cloud-saveInviteBtn" style="background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 4px; padding: 0;">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                儲存目前連結
                            </button>
                        </div>
                        <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="width: 100%; border-radius: 8px; padding: 10px 15px; box-sizing: border-box; font-size: 14px;">
                        <div id="cloud-savedLinksList" style="margin-top: 15px; display: flex; flex-direction: column; gap: 8px;">
                        </div>
                    </div>`;

if (indexContent.includes(linkTarget)) {
    indexContent = indexContent.replace(linkTarget, linkReplacement);
}

fs.writeFileSync(indexFile, indexContent, 'utf-8');
console.log('index.html updated successfully.');


const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const jsTarget = `        const inviteLinkInput = document.getElementById('cloud-inviteLink');
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

const jsReplacement = jsTarget + `
        
        // ===== Shared Invites Logic (Firebase) =====
        const saveInviteBtn = document.getElementById('cloud-saveInviteBtn');
        const savedLinksList = document.getElementById('cloud-savedLinksList');

        if (inviteLinkInput && openPikminBtn && saveInviteBtn && savedLinksList) {
            // Save logic
            saveInviteBtn.addEventListener('click', () => {
                const link = inviteLinkInput.value.trim();
                if (!link) {
                    alert('請先在下方輸入邀請連結！');
                    return;
                }
                const name = prompt('請為這個連結取一個名稱 (例如：小明的本尊)');
                if (name) {
                    database.ref('shared_invites').push({
                        name: name,
                        link: link,
                        createdAt: Date.now()
                    });
                }
            });

            // Listen to Firebase and render
            database.ref('shared_invites').on('value', snap => {
                savedLinksList.innerHTML = '';
                const data = snap.val() || {};
                
                // Convert to array and sort by createdAt
                const entries = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                entries.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

                entries.forEach(item => {
                    const el = document.createElement('div');
                    el.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px;';
                    
                    const leftDiv = document.createElement('div');
                    leftDiv.style.cssText = 'flex: 1; cursor: pointer; overflow: hidden;';
                    leftDiv.innerHTML = \`
                        <div style="font-weight: bold; font-size: 14px; color: #fff;">\${item.name}</div>
                        <div style="font-size: 12px; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${item.link}</div>
                    \`;
                    leftDiv.onclick = () => {
                        inviteLinkInput.value = item.link;
                        openPikminBtn.href = item.link;
                        inviteLinkInput.style.border = '2px solid #10b981';
                        setTimeout(() => inviteLinkInput.style.border = '', 1000);
                    };

                    const rightDiv = document.createElement('div');
                    rightDiv.style.cssText = 'display: flex; gap: 10px; margin-left: 10px;';

                    const editBtn = document.createElement('button');
                    editBtn.innerHTML = '✏️';
                    editBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0; font-size: 14px; color: #fff;';
                    editBtn.onclick = () => {
                        const newName = prompt('修改名稱：', item.name);
                        if (newName && newName !== item.name) {
                            database.ref('shared_invites/' + item.id).update({ name: newName });
                        }
                    };

                    const delBtn = document.createElement('button');
                    delBtn.innerHTML = '🗑️';
                    delBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 0; font-size: 14px; color: #fff;';
                    delBtn.onclick = () => {
                        if (confirm(\`確定要刪除「\${item.name}」的連結嗎？\`)) {
                            database.ref('shared_invites/' + item.id).remove();
                        }
                    };

                    rightDiv.appendChild(editBtn);
                    rightDiv.appendChild(delBtn);
                    
                    el.appendChild(leftDiv);
                    el.appendChild(rightDiv);
                    savedLinksList.appendChild(el);
                });
            });
        }
`;

if (jsContent.includes(jsTarget)) {
    jsContent = jsContent.replace(jsTarget, jsReplacement);
}

fs.writeFileSync(jsFile, jsContent, 'utf-8');
console.log('main.js updated successfully.');

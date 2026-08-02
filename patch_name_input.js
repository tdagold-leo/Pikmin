const fs = require('fs');

const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const linkTarget = `<input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="width: 100%; border-radius: 8px; padding: 10px 15px; box-sizing: border-box; font-size: 14px;">`;
const linkReplacement = `<div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-inviteName" placeholder="名稱 (例:小明)" style="width: 110px; border-radius: 8px; padding: 10px; box-sizing: border-box; font-size: 14px; flex-shrink: 0;">
                            <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="flex: 1; border-radius: 8px; padding: 10px; box-sizing: border-box; font-size: 14px; min-width: 0;">
                        </div>`;

if (indexContent.includes(linkTarget)) {
    indexContent = indexContent.replace(linkTarget, linkReplacement);
    fs.writeFileSync(indexFile, indexContent, 'utf-8');
    console.log('index.html updated successfully.');
} else {
    console.log('Target string not found in index.html');
}

const jsFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js';
let jsContent = fs.readFileSync(jsFile, 'utf-8');

const jsTargetSave = `            saveInviteBtn.addEventListener('click', () => {
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
            });`;

const jsReplacementSave = `            const inviteNameInput = document.getElementById('cloud-inviteName');
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
                database.ref('shared_invites').push({
                    name: name,
                    link: link,
                    createdAt: Date.now()
                });
                if(inviteNameInput) inviteNameInput.value = '';
                inviteLinkInput.value = '';
            });`;

if (jsContent.includes(jsTargetSave)) {
    jsContent = jsContent.replace(jsTargetSave, jsReplacementSave);
}

const jsTargetClick = `                    leftDiv.onclick = () => {
                        inviteLinkInput.value = item.link;
                        openPikminBtn.href = item.link;
                        inviteLinkInput.style.border = '2px solid #10b981';
                        setTimeout(() => inviteLinkInput.style.border = '', 1000);
                    };`;

const jsReplacementClick = `                    leftDiv.onclick = () => {
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
                    };`;

if (jsContent.includes(jsTargetClick)) {
    jsContent = jsContent.replace(jsTargetClick, jsReplacementClick);
}

fs.writeFileSync(jsFile, jsContent, 'utf-8');
console.log('main.js updated successfully.');

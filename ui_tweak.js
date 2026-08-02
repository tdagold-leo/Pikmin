const fs = require('fs');

const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

// 1. Update Email display font size
const emailTarget = '<div id="cloud-emailDisplay" class="info-value">--</div>';
const emailReplacement = '<div id="cloud-emailDisplay" class="info-value" style="font-size: 18px; word-break: break-all; margin: 10px 0;">--</div>';
if (indexContent.includes(emailTarget)) {
    indexContent = indexContent.replace(emailTarget, emailReplacement);
}

// 2. Fix Invite Link alignment
const linkTarget = `                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-inviteLink">Pikmin 邀請連結 (自訂)</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="flex: 1; border-radius: 8px;">
                            <div style="width: 48px; flex-shrink: 0;"></div>
                        </div>
                    </div>`;
const linkReplacement = `                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-inviteLink">Pikmin 邀請連結 (自訂)</label>
                        <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="width: 100%; border-radius: 8px; padding: 10px 15px; box-sizing: border-box; font-size: 14px;">
                    </div>`;
if (indexContent.includes(linkTarget)) {
    indexContent = indexContent.replace(linkTarget, linkReplacement);
}

fs.writeFileSync(indexFile, indexContent, 'utf-8');
console.log('index.html updated successfully.');

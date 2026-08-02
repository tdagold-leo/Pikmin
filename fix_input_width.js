const fs = require('fs');

const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const target = `                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-inviteLink">Pikmin 邀請連結 (自訂)</label>
                        <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="width: 100%; border-radius: 8px;">
                    </div>`;

const replacement = `                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="cloud-inviteLink">Pikmin 邀請連結 (自訂)</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cloud-inviteLink" placeholder="例如: https://pikminbloom.onelink.me/..." style="flex: 1; border-radius: 8px;">
                            <div style="width: 48px; flex-shrink: 0;"></div>
                        </div>
                    </div>`;

if (indexContent.includes(target)) {
    indexContent = indexContent.replace(target, replacement);
    fs.writeFileSync(indexFile, indexContent, 'utf-8');
    console.log('Success');
} else {
    console.log('Target not found');
}

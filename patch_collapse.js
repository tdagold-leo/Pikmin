const fs = require('fs');

const indexFile = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let indexContent = fs.readFileSync(indexFile, 'utf-8');

const target = `<div id="cloud-savedLinksList" style="margin-top: 15px; display: flex; flex-direction: column; gap: 8px;">
                        </div>`;

const replacement = `<details style="margin-top: 15px;">
                            <summary style="cursor: pointer; font-size: 14px; color: #94a3b8; outline: none; padding: 5px 0; user-select: none; font-weight: bold;">
                                共用清單 (點此展開)
                            </summary>
                            <div id="cloud-savedLinksList" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                            </div>
                        </details>`;

if (indexContent.includes(target)) {
    indexContent = indexContent.replace(target, replacement);
    fs.writeFileSync(indexFile, indexContent, 'utf-8');
    console.log('index.html updated successfully.');
} else {
    console.log('Target string not found in index.html');
}

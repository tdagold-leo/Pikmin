const fs = require('fs');

let jsContent = fs.readFileSync('js/main.js', 'utf8');

const replacementStats = `                statsEl.style.display = 'flex';
                statsEl.style.justifyContent = 'space-around';
                statsEl.style.background = '#f8fafc';
                statsEl.style.border = '1px solid #e2e8f0';
                statsEl.style.borderRadius = '12px';
                statsEl.style.padding = '8px 12px';
                statsEl.style.marginBottom = '8px';

                statsEl.innerHTML = \`
                    <div onclick="document.getElementById('postcard-recent-filter').value='1'; updateView();" style="cursor:pointer; display:flex; align-items:center; gap:6px;" title="過濾：最近 1 天新增">
                        <span style="color:#64748b; font-size:12px; font-weight:bold;">最新 1 天</span>
                        <span style="font-weight:900; color:#3b82f6; font-size:16px;">\${cnt1d}</span>
                    </div>
                    <div style="width:1px; background:#cbd5e1; margin:0 4px;"></div>
                    <div onclick="document.getElementById('postcard-recent-filter').value='3'; updateView();" style="cursor:pointer; display:flex; align-items:center; gap:6px;" title="過濾：最近 3 天新增">
                        <span style="color:#64748b; font-size:12px; font-weight:bold;">最近 3 天</span>
                        <span style="font-weight:900; color:#0ea5e9; font-size:16px;">\${cnt3d}</span>
                    </div>
                    <div style="width:1px; background:#cbd5e1; margin:0 4px;"></div>
                    <div onclick="document.getElementById('postcard-recent-filter').value='all'; updateView();" style="cursor:pointer; display:flex; align-items:center; gap:6px;" title="取消時間過濾 (不含金盆)">
                        <span style="color:#64748b; font-size:12px; font-weight:bold;">總數</span>
                        <span style="font-weight:900; color:#10b981; font-size:16px;">\${cntAll}</span>
                    </div>
                \`;`;

const startReplace = jsContent.indexOf('const makeStatCard = (cls, label, value, sub, onclick) =>');
const endReplace = jsContent.indexOf('updateView();`);', startReplace) + 'updateView();`);'.length;

if (startReplace !== -1 && endReplace !== -1) {
    jsContent = jsContent.substring(0, startReplace) + replacementStats + jsContent.substring(endReplace);
    fs.writeFileSync('js/main.js', jsContent);
    console.log('Stats replaced!');
} else {
    console.log('Target not found');
}

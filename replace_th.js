const fs = require('fs');
let jsContent = fs.readFileSync('js/main.js', 'utf8');

const targetTH = `                        const th = document.createElement('div');
                        th.style.cssText = 'grid-column: 1 / -1; display:flex; align-items:center; gap:8px; padding:6px 12px; margin:4px 0; background:linear-gradient(135deg,rgba(56,189,248,0.10),rgba(14,165,233,0.06)); border-radius:8px; border:1px solid rgba(56,189,248,0.25); cursor:pointer; user-select:none; font-size:13px; font-weight:bold; color:#0284c7;';
                        if (tName === '絕版') {
                            th.style.background = 'linear-gradient(135deg,rgba(100,116,139,0.1),rgba(71,85,105,0.06))';
                            th.style.borderColor = 'rgba(100,116,139,0.2)';
                            th.style.color = '#475569';
                        }

                        let topReminders = '';
                        if (hasMissingTop) topReminders += ' <span style="color:#ef4444; font-size:12px; font-weight:bold; margin-left:4px;">❗缺</span>';
                        if (hasClaimableTop) topReminders += ' <span style="color:#d97706; font-size:12px; font-weight:bold; margin-left:4px;">⚠️可拿</span>';

                        th.innerHTML = \`<span>\${isTopCol?'▶':'▼'}</span> <span style="flex:1;">📌 \${tName}\${topReminders}</span> <span style="background:rgba(0,0,0,0.1); padding:2px 8px; border-radius:10px; font-size:11px;">\${tItems.length} 筆</span>\`;
                        th.addEventListener('click', () => toggleGroup(topId));
                        pcEl.appendChild(th);`;

const replacementTH = `                        const th = document.createElement('div');
                        th.className = 'group-header';
                        th.style.background = 'transparent';
                        th.style.boxShadow = 'none';
                        th.style.justifyContent = 'flex-start';
                        th.style.padding = '4px 0';
                        th.style.marginTop = '16px';

                        let pastelBg = 'hsl(200, 85%, 94%)';
                        let darkText = 'hsl(200, 85%, 30%)';
                        let borderColor = 'hsl(200, 85%, 85%)';

                        if (tName === '期間 (進行中)') {
                            pastelBg = 'hsl(35, 85%, 94%)';
                            darkText = 'hsl(35, 85%, 30%)';
                            borderColor = 'hsl(35, 85%, 85%)';
                        } else if (tName === '絕版') {
                            pastelBg = 'hsl(215, 16%, 94%)';
                            darkText = 'hsl(215, 16%, 30%)';
                            borderColor = 'hsl(215, 16%, 85%)';
                        }

                        let topReminders = '';
                        if (hasMissingTop) topReminders += ' <span style="color:#dc2626; font-size:12px; font-weight:bold; background:#fef2f2; border:1px solid #fca5a5; padding:2px 8px; border-radius:12px; margin-left:8px;">⚠️ 缺</span>';
                        if (hasClaimableTop) topReminders += ' <span style="color:#d97706; font-size:12px; font-weight:bold; background:#fffbeb; border:1px solid #fcd34d; padding:2px 8px; border-radius:12px; margin-left:8px;">🎁 可拿</span>';

                        th.innerHTML = \`
                            <div style="background:\${pastelBg}; border:1px solid \${borderColor}; color:\${darkText}; padding:6px 14px; border-radius:16px; display:inline-flex; align-items:center; gap:10px; font-size:16px; font-weight:bold; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:all 0.2s;">
                                <span>\${isTopCol?'▶':'▼'} 📌 \${tName}</span>
                                <span style="background:rgba(255,255,255,0.7); padding:2px 8px; border-radius:12px; font-size:13px; font-weight:900;">\${tItems.length} 筆</span>
                            </div>\${topReminders}
                        \`;
                        th.addEventListener('click', () => toggleGroup(topId));
                        pcEl.appendChild(th);`;

const normalize = str => str.replace(/\r\n/g, '\n').trim();

const targetNormalized = normalize(targetTH);
const startIdx = normalize(jsContent).indexOf(targetNormalized.substring(0, 100));

if (startIdx !== -1) {
    const startReplace = jsContent.indexOf("const th = document.createElement('div');", jsContent.indexOf("const topOrder = ['常駐', '期間 (進行中)', '絕版'];"));
    const endReplace = jsContent.indexOf("pcEl.appendChild(th);", startReplace) + "pcEl.appendChild(th);".length;
    
    if (startReplace !== -1 && endReplace !== -1) {
        jsContent = jsContent.substring(0, startReplace) + replacementTH + jsContent.substring(endReplace);
        fs.writeFileSync('js/main.js', jsContent);
        console.log('th replaced!');
    }
} else {
    console.log('Target not found');
}

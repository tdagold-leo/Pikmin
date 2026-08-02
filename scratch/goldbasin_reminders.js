const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// Replace top-level (th) logic
const topLevelRegex = /const isTopCol = collapsedGroups\.has\(topId\);\s*\n\s*\/\/ 在 pcEl 網格內放一個橫跨全寬的大標題[\s\S]*?th\.innerHTML = `<span>\$\{isTopCol\?'▶':'▼'\}<\/span> <span style="flex:1;">📌 \$\{tName\}<\/span> <span style="background:rgba\(0,0,0,0\.1\); padding:2px 8px; border-radius:10px; font-size:11px;">\$\{tItems\.length\} 筆<\/span>`;/;

const topLevelReplacement = `const isTopCol = collapsedGroups.has(topId);
                        
                        let hasClaimableTop = false;
                        let hasMissingTop = false;
                        tItems.forEach(item => {
                            if ((item.tag || '').includes('缺') || (item.name || '').includes('缺') || (item.note || '').includes('缺')) {
                                hasMissingTop = true;
                            }
                            if (item.sgCooldown && !item.discontinued) {
                                let hasStarted = true;
                                if (item.sgStart) {
                                    const startDate = new Date(item.sgStart + 'T00:00:00');
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    if (startDate > today) hasStarted = false;
                                }
                                if (hasStarted) {
                                    if (!item.sgLast) hasClaimableTop = true;
                                    else {
                                        const lastDate = new Date(item.sgLast + 'T00:00:00');
                                        const nextDate = new Date(lastDate.getTime() + parseInt(item.sgCooldown, 10) * 86400000);
                                        const today = new Date();
                                        today.setHours(0,0,0,0);
                                        if (nextDate <= today) hasClaimableTop = true;
                                    }
                                }
                            }
                        });

                        // 在 pcEl 網格內放一個橫跨全寬的大標題，類似原本金盆的大標題，但稍微小一點以示區別
                        const th = document.createElement('div');
                        th.style.cssText = 'grid-column: 1 / -1; display:flex; align-items:center; gap:8px; padding:6px 12px; margin:4px 0; background:linear-gradient(135deg,rgba(56,189,248,0.10),rgba(14,165,233,0.06)); border-radius:8px; border:1px solid rgba(56,189,248,0.25); cursor:pointer; user-select:none; font-size:13px; font-weight:bold; color:#0284c7;';
                        if (tName === '絕版') {
                            th.style.background = 'linear-gradient(135deg,rgba(100,116,139,0.1),rgba(71,85,105,0.06))';
                            th.style.borderColor = 'rgba(100,116,139,0.2)';
                            th.style.color = '#475569';
                        }
                        
                        let topReminders = '';
                        if (hasMissingTop) topReminders += ' <span style="color:#ef4444; font-size:12px; margin-left:4px;">❗缺</span>';
                        if (hasClaimableTop) topReminders += ' <span style="color:#d97706; font-size:12px; margin-left:4px;">⚠️可拿</span>';
                        
                        th.innerHTML = \`<span>\${isTopCol?'▶':'▼'}</span> <span style="flex:1;">📌 \${tName}\${topReminders}</span> <span style="background:rgba(0,0,0,0.1); padding:2px 8px; border-radius:10px; font-size:11px;">\${tItems.length} 筆</span>\`;`;

if (mainJs.match(topLevelRegex)) {
    mainJs = mainJs.replace(topLevelRegex, topLevelReplacement);
    console.log('Successfully updated top-level gold basin header');
} else {
    console.log('Regex failed for top-level gold basin header');
}

// Replace subgroup (ah) logic
const subLevelRegex = /let hasClaimable = false;\s*actMap\[act\]\.forEach\(item => \{\s*if \(item\.sgCooldown[\s\S]*?ah\.innerHTML = `[\s\S]*?`;/;

const subLevelReplacement = `let hasClaimable = false;
                                let hasMissing = false;
                                actMap[act].forEach(item => {
                                    if ((item.tag || '').includes('缺') || (item.name || '').includes('缺') || (item.note || '').includes('缺')) {
                                        hasMissing = true;
                                    }
                                    if (item.sgCooldown && !item.discontinued) {
                                        let hasStarted = true;
                                        if (item.sgStart) {
                                            const startDate = new Date(item.sgStart + 'T00:00:00');
                                            const today = new Date();
                                            today.setHours(0,0,0,0);
                                            if (startDate > today) hasStarted = false;
                                        }
                                        if (hasStarted) {
                                            if (!item.sgLast) hasClaimable = true;
                                            else {
                                                const lastDate = new Date(item.sgLast + 'T00:00:00');
                                                const nextDate = new Date(lastDate.getTime() + parseInt(item.sgCooldown, 10) * 86400000);
                                                const today = new Date();
                                                today.setHours(0,0,0,0);
                                                if (nextDate <= today) hasClaimable = true;
                                            }
                                        }
                                    }
                                });

                                if (hasClaimable) {
                                    ah.className += ' alert-pulse';
                                    ah.style.position = 'relative';
                                }

                                // 正方形內：數字、圖示+活動名稱
                                let dateSubtitle = '';
                                const firstItem = actMap[act][0];
                                if (firstItem && firstItem.sgType === '期間' && (firstItem.sgStart || firstItem.sgEnd)) {
                                    const sStr = firstItem.sgStart ? firstItem.sgStart.substring(5).replace('-', '/') : '未定';
                                    const eStr = firstItem.sgEnd ? firstItem.sgEnd.substring(5).replace('-', '/') : '未定';
                                    dateSubtitle = \`<div style="font-size:11px; color:#5b21b6; background:#e0e7ff; padding:3px 8px; border-radius:12px; margin-top:6px; font-weight:bold; display:inline-block; border:1px solid #c7d2fe; letter-spacing:0.5px;">📅 \${sStr} ~ \${eStr}</div>\`;
                                }
                                
                                let subReminders = '';
                                if (hasMissing) subReminders += ' <span style="color:#ef4444; font-size:11px; margin-left:2px;">❗缺</span>';
                                if (hasClaimable) subReminders += ' <span style="color:#d97706; font-size:11px; margin-left:2px;">⚠️可拿</span>';

                                ah.innerHTML = \`
                                    <div class="count">\${actMap[act].length}</div>
                                    <div class="title">\${isActCol ? '▶' : '▼'} \${escapeHtml(act)}\${subReminders}</div>
                                    \${dateSubtitle}
                                \`;`;

if (mainJs.match(subLevelRegex)) {
    mainJs = mainJs.replace(subLevelRegex, subLevelReplacement);
    console.log('Successfully updated sub-level gold basin header');
} else {
    console.log('Regex failed for sub-level gold basin header');
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

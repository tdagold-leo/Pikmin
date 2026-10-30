const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const targetStart = '// 依活動（sgActivity 或 tag）分子群組，使用正方形按鈕';
const targetEnd = 'if (!isActCol) {';

const p1 = js.indexOf(targetStart);
const p2 = js.indexOf(targetEnd, p1);

if (p1 !== -1 && p2 !== -1) {
    const codeToReplace = js.slice(p1, p2);

    const newCode = `// 依活動（sgActivity 或 tag）分子群組，並支援子群組（用 - 或 / 等分隔）
                            const mainActMap = {}, mainActOrder = [];
                            tItems.forEach(item => {
                                const rawAct = (item.sgActivity || item.tag || '未分類').trim();
                                let mainAct = rawAct;
                                let subAct = '';
                                const sepMatch = rawAct.match(/\\s*(?:[-/＞>]|——|=>|->)\\s*/);
                                if (sepMatch) {
                                    const sepIdx = rawAct.indexOf(sepMatch[0]);
                                    mainAct = rawAct.substring(0, sepIdx).trim();
                                    subAct = rawAct.substring(sepIdx + sepMatch[0].length).trim();
                                }
                                
                                if (!mainActMap[mainAct]) { mainActMap[mainAct] = {}; mainActOrder.push(mainAct); }
                                if (!mainActMap[mainAct][subAct]) { mainActMap[mainAct][subAct] = []; }
                                mainActMap[mainAct][subAct].push(item);
                            });
                            
                            mainActOrder.sort().forEach(mainAct => {
                                const subActs = Object.keys(mainActMap[mainAct]).sort();
                                const hasRealSubgroups = subActs.length > 1 || (subActs.length === 1 && subActs[0] !== '');
                                
                                if (hasRealSubgroups) {
                                    const mainHeader = document.createElement('div');
                                    mainHeader.style.cssText = 'grid-column: 1 / -1; display:flex; align-items:center; gap:8px; padding:12px 4px 4px; margin-top:8px; border-bottom:1.5px dashed #cbd5e1;';
                                    mainHeader.innerHTML = \`<span style="font-size:15px; font-weight:bold; color:#475569;">📍 \${escapeHtml(mainAct)}</span>\`;
                                    pcEl.appendChild(mainHeader);
                                }
                                
                                subActs.forEach(subAct => {
                                    const itemsList = mainActMap[mainAct][subAct];
                                    const displayActName = hasRealSubgroups ? (subAct || '基本') : mainAct;
                                    const rawAct = (itemsList[0].sgActivity || itemsList[0].tag || '未分類').trim();
                                    
                                    const actId = 'pc-act-' + tName + '-' + mainAct + '-' + subAct;
                                    if (!knownPostcardGroups.has(actId)) { collapsedGroups.add(actId); knownPostcardGroups.add(actId); }
                                    const isActCol = collapsedGroups.has(actId);
                                    const ah = document.createElement('div');
                                    ah.className = 'sq-group-header';
                                    
                                    let hasClaimable = false;
                                    let hasMissing = false;
                                    const now = new Date();
                                    const todayStr = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;

                                    itemsList.forEach(item => {
                                        if ((item.tag || '').includes('缺') || (item.name || '').includes('缺') || (item.note || '').includes('缺') || (item.user || '').includes('缺')) {
                                            hasMissing = true;
                                        }
                                        let localIsDisc = item.discontinued === true;
                                        if (item.sgType === '期間' && item.sgEnd) {
                                            const endDate = new Date(item.sgEnd);
                                            endDate.setHours(23, 59, 59, 999);
                                            if (Date.now() > endDate.getTime()) localIsDisc = true;
                                        }
                                        item._localIsDisc = localIsDisc; 

                                        let cdVal = item.sgCooldown;
                                        if (!cdVal && item.tag && (item.tag.includes('30天') || item.tag.includes('30 天') || item.tag.includes('一個月') || item.tag.includes('30 days'))) {
                                            cdVal = '30';
                                        }
                                        if (!cdVal && (item.sgType === '期間' || item.sgType === '常駐')) {
                                            cdVal = '30';
                                        }
                                        if (cdVal && !localIsDisc) {
                                            let hasStarted = true;
                                            if (item.sgType === '期間' && item.sgStart) {
                                                const startDate = new Date(item.sgStart + 'T00:00:00');
                                                const today = new Date();
                                                today.setHours(0,0,0,0);
                                                if (startDate > today) hasStarted = false;
                                            }
                                            if (hasStarted) {
                                                if (!item.sgLast) hasClaimable = true;
                                                else {
                                                    const lastDate = new Date(item.sgLast + 'T00:00:00');
                                                    const nextDate = parseInt(cdVal, 10) === 30 ? new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate()) : new Date(lastDate.getTime() + parseInt(cdVal, 10) * 86400000);
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

                                    let dateSubtitle = '';
                                    const firstItem = itemsList[0];
                                    if (firstItem && firstItem.sgType === '期間' && (firstItem.sgStart || firstItem.sgEnd)) {
                                        const sStr = firstItem.sgStart ? firstItem.sgStart.substring(5).replace('-', '/') : '未定';
                                        const eStr = firstItem.sgEnd ? firstItem.sgEnd.substring(5).replace('-', '/') : '未定';
                                        dateSubtitle = \`<div style="font-size:11px; color:#5b21b6; background:#e0e7ff; padding:3px 8px; border-radius:12px; margin-top:4px; font-weight:bold; display:inline-block; border:1px solid #c7d2fe; letter-spacing:0.5px;">📅 \${sStr} ~ \${eStr}</div>\`;
                                    }

                                    let cooldownBadge = '';
                                    if (firstItem) {
                                        let cdVal = firstItem.sgCooldown;
                                        if (!cdVal && firstItem.tag && (firstItem.tag.includes('30天') || firstItem.tag.includes('30 天') || firstItem.tag.includes('一個月') || firstItem.tag.includes('30 days'))) cdVal = '30';
                                        if (!cdVal && (firstItem.sgType === '期間' || firstItem.sgType === '常駐')) cdVal = '30';
                                        if (cdVal && !firstItem._localIsDisc) {
                                            const cdNum = parseInt(cdVal, 10);
                                            const cdLabel = cdNum === 1 ? '每天可領' : cdNum === 30 ? '每月可領' : \`每 \${cdNum} 天可領\`;
                                            cooldownBadge = \`<div style="font-size:11px; color:#b45309; background:#fef3c7; padding:2px 8px; border-radius:12px; margin-top:4px; font-weight:bold; display:inline-block; border:1px solid #fde68a; letter-spacing:0.5px;">⏱ \${cdLabel}</div>\`;
                                        }
                                    }

                                    let subReminders = '';
                                    if (hasMissing) subReminders += ' <span style="color:#ef4444; font-size:11px; font-weight:bold; margin-left:2px;">❗缺</span>';
                                    if (hasClaimable) subReminders += ' <span style="color:#d97706; font-size:11px; font-weight:bold; margin-left:2px;">⚠️可拿</span>';

                                    const allDiscontinued = itemsList.length > 0 && itemsList.every(item => item._localIsDisc);
                                    const groupClaimBtnHtml = allDiscontinued ? '' : \`
                                        <button type="button" class="group-claim-btn \${!hasClaimable ? 'claimed' : ''}" 
                                                onclick="markGroupClaimedToday('\${escapeHtml(rawAct).replace(/'/g, "\\\\'")}', event)" 
                                                title="一鍵將群組內所有卡片設為今日已領">
                                            \${!hasClaimable ? '✓ 今日已領' : '🎁 今日領取'}
                                        </button>
                                    \`;
                                    
                                    const groupCopyBtnHtml = \`
                                        <button type="button" class="group-claim-btn claimed"
                                                onclick="copyGroupCoords('\${escapeHtml(rawAct).replace(/'/g, "\\\\'")}', event)"
                                                title="一鍵複製群組內所有座標">
                                            📋 複製座標
                                        </button>
                                    \`;

                                    ah.innerHTML = \`
                                        <div class="count">\${itemsList.length}</div>
                                        <div class="title">\${isActCol ? '▶' : '▼'} \${escapeHtml(displayActName)}\${subReminders}</div>
                                        \${dateSubtitle}
                                        \${cooldownBadge}
                                        <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">\${groupClaimBtnHtml}\${groupCopyBtnHtml}</div>
                                    \`;
                                    ah.addEventListener('click', () => toggleGroup(actId));
                                    pcEl.appendChild(ah);
                                    
                                    `;

    js = js.replace(codeToReplace, newCode);
    
    // Also, we need to replace the original render loop below `if (!isActCol) {` because it previously used `actMap[act]`.
    const lowerTargetStart = `if (!isActCol) {
                                    actMap[act].forEach(item => renderItem(item, type));
                                }
                            });`;
                            
    const newLowerTarget = `if (!isActCol) {
                                        itemsList.forEach(item => renderItem(item, type));
                                    }
                                });
                            });`;
                            
    js = js.replace(lowerTargetStart, newLowerTarget);

    js = js.replace(/v=\d{10,14}/g, 'v=202610110255');
    fs.writeFileSync('js/main.js', js);
    
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0255"');
    html = html.replace(/v=\d{10,14}/g, 'v=202610110255');
    fs.writeFileSync('index.html', html);
    
    console.log('Subgroup feature added successfully.');
} else {
    console.log('Could not find target strings.');
}

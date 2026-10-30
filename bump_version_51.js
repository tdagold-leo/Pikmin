const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/\r\n/g, '\n');

const pStart = js.indexOf('// 依活動（sgActivity 或 tag）分子群組');
const searchString = `                                    if (!isActCol) {
                                        itemsList.forEach(item => renderItem(item, type));
                                    }
                                });
                            });`;
const pEnd = js.indexOf(searchString, pStart);

if (pStart === -1 || pEnd === -1) {
    console.log('Cannot find boundaries', pStart, pEnd);
    process.exit(1);
}
const endPos = pEnd + searchString.length;

const targetCode = js.substring(pStart, endPos);

const newCode = `// 依大活動 (mainAct) 分群，內部再分子群組 (subAct)
                            const actMap = {};
                            const mainActOrder = [];
                            tItems.forEach(item => {
                                const rawAct = (item.sgActivity || item.tag || '未分類').trim();
                                let mainAct = rawAct;
                                let subAct = (item.sgSubActivity || '').trim();
                                if (!subAct) {
                                    const sepMatch = rawAct.match(/\\s*(?:[-/＞>]|——|=>|->)\\s*/);
                                    if (sepMatch) {
                                        const sepIdx = rawAct.indexOf(sepMatch[0]);
                                        mainAct = rawAct.substring(0, sepIdx).trim();
                                        subAct = rawAct.substring(sepIdx + sepMatch[0].length).trim();
                                    }
                                }
                                item._computedMainAct = mainAct;
                                item._computedSubAct = subAct;

                                if (!actMap[mainAct]) {
                                    actMap[mainAct] = { totalItems: [], subMap: {} };
                                    mainActOrder.push(mainAct);
                                }
                                actMap[mainAct].totalItems.push(item);
                                if (!actMap[mainAct].subMap[subAct]) {
                                    actMap[mainAct].subMap[subAct] = [];
                                }
                                actMap[mainAct].subMap[subAct].push(item);
                            });

                            mainActOrder.sort().forEach(mainAct => {
                                const actData = actMap[mainAct];
                                const itemsList = actData.totalItems;
                                
                                const actId = 'pc-act-' + tName + '-' + mainAct;
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
                                    if (!cdVal && item.tag && (item.tag.includes('30天') || item.tag.includes('30 天') || item.tag.includes('一個月') || item.tag.includes('30 days'))) cdVal = '30';
                                    if (!cdVal && (item.sgType === '期間' || item.sgType === '常駐')) cdVal = '30';
                                    
                                    if (cdVal && !localIsDisc) {
                                        let hasStarted = true;
                                        if (item.sgType === '期間' && item.sgStart) {
                                            const startDate = new Date(item.sgStart + 'T00:00:00');
                                            const today = new Date(); today.setHours(0,0,0,0);
                                            if (startDate > today) hasStarted = false;
                                        }
                                        if (hasStarted) {
                                            if (!item.sgLast) hasClaimable = true;
                                            else {
                                                const lastDate = new Date(item.sgLast + 'T00:00:00');
                                                const nextDate = parseInt(cdVal, 10) === 30 ? new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate()) : new Date(lastDate.getTime() + parseInt(cdVal, 10) * 86400000);
                                                const today = new Date(); today.setHours(0,0,0,0);
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
                                            onclick="markGroupClaimedToday('\${escapeHtml(mainAct).replace(/'/g, "\\\\'")}', '__ALL__', event)" 
                                            title="一鍵將群組內所有卡片設為今日已領">
                                        \${!hasClaimable ? '✓ 今日已領' : '🎁 今日領取'}
                                    </button>
                                \`;
                                
                                const groupCopyBtnHtml = \`
                                    <button type="button" class="group-claim-btn claimed"
                                            onclick="copyGroupCoords('\${escapeHtml(mainAct).replace(/'/g, "\\\\'")}', '__ALL__', event)"
                                            title="一鍵複製群組內所有座標">
                                        📋 複製座標
                                    </button>
                                \`;

                                ah.innerHTML = \`
                                    <div class="count">\${itemsList.length}</div>
                                    <div class="title">\${isActCol ? '▶' : '▼'} \${escapeHtml(mainAct)}\${subReminders}</div>
                                    \${dateSubtitle}
                                    \${cooldownBadge}
                                    <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">\${groupClaimBtnHtml}\${groupCopyBtnHtml}</div>
                                \`;
                                ah.addEventListener('click', () => toggleGroup(actId));
                                pcEl.appendChild(ah);
                                
                                if (!isActCol) {
                                    const subActs = Object.keys(actData.subMap).sort();
                                    const hasRealSubgroups = subActs.length > 1 || (subActs.length === 1 && subActs[0] !== '');

                                    if (!hasRealSubgroups) {
                                        itemsList.forEach(item => renderItem(item, type));
                                    } else {
                                        subActs.forEach(subAct => {
                                            const subItems = actData.subMap[subAct];
                                            const displaySubName = subAct || '基本';
                                            
                                            let subHasClaimable = false;
                                            subItems.forEach(item => {
                                                if (item._localIsDisc) return;
                                                let cdVal = item.sgCooldown || '30';
                                                let hasStarted = true;
                                                if (item.sgType === '期間' && item.sgStart) {
                                                    const startDate = new Date(item.sgStart + 'T00:00:00');
                                                    const today = new Date(); today.setHours(0,0,0,0);
                                                    if (startDate > today) hasStarted = false;
                                                }
                                                if (hasStarted) {
                                                    if (!item.sgLast) subHasClaimable = true;
                                                    else {
                                                        const lastDate = new Date(item.sgLast + 'T00:00:00');
                                                        const nextDate = parseInt(cdVal, 10) === 30 ? new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate()) : new Date(lastDate.getTime() + parseInt(cdVal, 10) * 86400000);
                                                        const today = new Date(); today.setHours(0,0,0,0);
                                                        if (nextDate <= today) subHasClaimable = true;
                                                    }
                                                }
                                            });

                                            const subAllDisc = subItems.length > 0 && subItems.every(item => item._localIsDisc);

                                            const divider = document.createElement('div');
                                            divider.style.cssText = 'grid-column: 1 / -1; display:flex; align-items:center; justify-content:space-between; padding:8px 12px; margin:12px 0 4px; background:#f8fafc; border-radius:8px; border-left:4px solid #94a3b8; box-shadow:0 1px 2px rgba(0,0,0,0.05);';
                                            
                                            const titleHtml = \`<div style="font-size:13px; font-weight:bold; color:#475569; display:flex; align-items:center; gap:6px;">📍 \${escapeHtml(displaySubName)} <span style="color:#64748b; font-size:11px; font-weight:normal; background:#e2e8f0; padding:2px 6px; border-radius:12px;">\${subItems.length}</span></div>\`;
                                            
                                            const subClaimBtn = subAllDisc ? '' : \`<button type="button" class="group-claim-btn \${!subHasClaimable ? 'claimed' : ''}" onclick="markGroupClaimedToday('\${escapeHtml(mainAct).replace(/'/g, "\\\\'")}', '\${escapeHtml(subAct).replace(/'/g, "\\\\'")}', event)" style="padding:4px 8px; font-size:11px; margin:0; min-height:0;">\${!subHasClaimable ? '✓ 已領' : '🎁 領取'}</button>\`;
                                            const subCopyBtn = \`<button type="button" class="group-claim-btn claimed" onclick="copyGroupCoords('\${escapeHtml(mainAct).replace(/'/g, "\\\\'")}', '\${escapeHtml(subAct).replace(/'/g, "\\\\'")}', event)" style="padding:4px 8px; font-size:11px; margin-left:6px; min-height:0;">📋 座標</button>\`;
                                            
                                            divider.innerHTML = \`\${titleHtml}<div style="display:flex; align-items:center;">\${subClaimBtn}\${subCopyBtn}</div>\`;
                                            pcEl.appendChild(divider);
                                            
                                            subItems.forEach(item => renderItem(item, type));
                                        });
                                    }
                                }
                            });`;

js = js.replace(targetCode, newCode);

const markClaimedOld = `        postcardList.forEach(item => {
            if (item.type === '特殊金盆' && item._computedMainAct === mainAct && item._computedSubAct === subAct) {
                item.sgLast = todayStr;`;
const markClaimedNew = `        postcardList.forEach(item => {
            if (item.type === '特殊金盆' && item._computedMainAct === mainAct) {
                if (subAct === '__ALL__' || item._computedSubAct === subAct) {
                    item.sgLast = todayStr;
                    personal[item.id] = todayStr;
                    changed[item.id] = todayStr;
                    count++;
                }
            }
        });`;
// Only replace the inner part of markGroupClaimedToday
js = js.replace(
    /        postcardList\.forEach\(item => \{\n            if \(item\.type === '特殊金盆' && item\._computedMainAct === mainAct && item\._computedSubAct === subAct\) \{\n                item\.sgLast = todayStr;\n                personal\[item\.id\] = todayStr;\n                changed\[item\.id\] = todayStr;\n                count\+\+;\n            \}\n        \}\);/,
    markClaimedNew
);

const copyCoordsOld = `        postcardList.forEach(item => {
            if (item.type === '特殊金盆' && item._computedMainAct === mainAct && item._computedSubAct === subAct && item.coords) {
                const normalized = normalizeCoords(String(item.coords));`;
const copyCoordsNew = `        postcardList.forEach(item => {
            if (item.type === '特殊金盆' && item._computedMainAct === mainAct && item.coords) {
                if (subAct === '__ALL__' || item._computedSubAct === subAct) {
                    const normalized = normalizeCoords(String(item.coords));
                    lines.push((os === 'ios' || os === 'macos' || os === 'windows') ? normalized.replace(/,/g, ' ') : normalized);
                }
            }
        });`;
js = js.replace(
    /        postcardList\.forEach\(item => \{\n            if \(item\.type === '特殊金盆' && item\._computedMainAct === mainAct && item\._computedSubAct === subAct && item\.coords\) \{\n                const normalized = normalizeCoords\(String\(item\.coords\)\);\n                lines\.push\(\(os === 'ios' \|\| os === 'macos' \|\| os === 'windows'\) \? normalized\.replace\(\/,\/g, ' '\) : normalized\);\n            \}\n        \}\);/,
    copyCoordsNew
);

js = js.replace(/v=\d{10,14}/g, 'v=202610110340');
fs.writeFileSync('js/main.js', js);
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/v=\d{10,14}/g, 'v=202610110340');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0340"');
fs.writeFileSync('index.html', html);
console.log('Script ran.');

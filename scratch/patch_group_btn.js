const fs = require('fs');
const path = require('path');

// 1. Patch index.html
const indexHtmlPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf-8').replace(/\r\n/g, '\n');

const targetTitleCss = `.sq-group-header .title {
            font-size: 13px;
            font-weight: 700;
            color: #334155;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            word-break: break-word;
        }`;

const replacementTitleCss = `.sq-group-header .title {
            font-size: 13px;
            font-weight: 700;
            color: #334155;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            word-break: break-word;
        }
        .sq-group-header .group-claim-btn {
            margin-top: 4px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: #ffffff;
            border: none;
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(34,197,94,0.3);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            white-space: nowrap;
            transition: all 0.15s ease-in-out;
            z-index: 2;
        }
        .sq-group-header .group-claim-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 3px 6px rgba(34,197,94,0.45);
        }
        .sq-group-header .group-claim-btn:active {
            transform: scale(0.96);
        }
        .sq-group-header .group-claim-btn.claimed {
            background: #f1f5f9;
            color: #64748b;
            border: 1px solid #cbd5e1;
            box-shadow: none;
            font-weight: 600;
        }
        .sq-group-header .group-claim-btn.claimed:hover {
            background: #e2e8f0;
            color: #334155;
            transform: scale(1.03);
        }`;

if (html.includes(targetTitleCss)) {
    html = html.replace(targetTitleCss, replacementTitleCss);
    fs.writeFileSync(indexHtmlPath, html, 'utf-8');
    console.log('Patched index.html CSS successfully');
} else {
    console.log('Could not find targetTitleCss in index.html');
}

// 2. Patch js/main.js
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8').replace(/\r\n/g, '\n');

const targetBlock = `                                let hasClaimable = false;
                                actMap[act].forEach(item => {
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
                                
                                ah.innerHTML = \`
                                    <div class="count">\${actMap[act].length}</div>
                                    <div class="title">\${isActCol ? '▶' : '▼'} \${escapeHtml(act)}</div>
                                    \${dateSubtitle}
                                \`;`;

const newBlock = `                                let hasClaimable = false;
                                const now = new Date();
                                const todayStr = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;
                                const isAllClaimedToday = actMap[act].length > 0 && actMap[act].every(item => item.sgLast === todayStr);

                                actMap[act].forEach(item => {
                                    let cdVal = item.sgCooldown;
                                    if (!cdVal && item.tag && (item.tag.includes('30天') || item.tag.includes('30 天') || item.tag.includes('一個月') || item.tag.includes('30 days'))) {
                                        cdVal = '30';
                                    }
                                    if (!cdVal && (item.sgType === '期間' || item.sgType === '常駐')) {
                                        cdVal = '30';
                                    }
                                    if (cdVal && !item.discontinued) {
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

                                // 正方形內：數字、圖示+活動名稱、期間標籤、今日領取按鈕
                                let dateSubtitle = '';
                                const firstItem = actMap[act][0];
                                if (firstItem && firstItem.sgType === '期間' && (firstItem.sgStart || firstItem.sgEnd)) {
                                    const sStr = firstItem.sgStart ? firstItem.sgStart.substring(5).replace('-', '/') : '未定';
                                    const eStr = firstItem.sgEnd ? firstItem.sgEnd.substring(5).replace('-', '/') : '未定';
                                    dateSubtitle = \`<div style="font-size:11px; color:#5b21b6; background:#e0e7ff; padding:3px 8px; border-radius:12px; margin-top:4px; font-weight:bold; display:inline-block; border:1px solid #c7d2fe; letter-spacing:0.5px;">📅 \${sStr} ~ \${eStr}</div>\`;
                                }

                                const groupClaimBtnHtml = \`
                                    <button type="button" class="group-claim-btn \${isAllClaimedToday ? 'claimed' : ''}" 
                                            onclick="markGroupClaimedToday('\${escapeHtml(act).replace(/'/g, "\\\\'")}', event)" 
                                            title="一鍵將群組內所有卡片設為今日已領">
                                        \${isAllClaimedToday ? '✓ 今日已領' : '🎁 今日領取'}
                                    </button>
                                \`;
                                
                                ah.innerHTML = \`
                                    <div class="count">\${actMap[act].length}</div>
                                    <div class="title">\${isActCol ? '▶' : '▼'} \${escapeHtml(act)}</div>
                                    \${dateSubtitle}
                                    \${groupClaimBtnHtml}
                                \`;`;

if (mainJs.includes(targetBlock)) {
    mainJs = mainJs.replace(targetBlock, newBlock);
    console.log('Updated sq-group-header HTML rendering in main.js');
} else {
    console.log('Could not find targetBlock in main.js');
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');
console.log('Done patching main.js');

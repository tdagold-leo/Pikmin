const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const oldFuncStart = `    function createMushroomCard(item, now, isExpired, timeText, isDup = false) {`;
const oldFuncEnd = `        return card;
    }`;

const oldFuncRegex = new RegExp(oldFuncStart.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '[\\s\\S]*?' + oldFuncEnd.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));

const newFunc = `    function createMushroomCard(item, now, isExpired, timeText, isDup = false) {
        const safeC = toTW(escapeHtml(item.country||'')), safeName = escapeHtml(item.name), safeTag = escapeHtml(item.tag);
        const diffStr = getTimeDiffString(safeC);
        // 將國家與時差的字體縮小，準備放到 Header
        const cHtml = safeC ? \`<span style="font-size:11px; color:#6b7280; font-weight:bold; white-space:nowrap; margin-left:4px;">\${safeC}</span> \${diffStr ? \`<span class="tz-badge">\${diffStr}</span>\` : ''}\` : '';
        const tHtml = safeTag ? \`<span class="tag-badge">\${safeTag}</span>\` : '';
        const dupBadge = isDup ? \`<span style="font-size:11px; color:#b45309; font-weight:bold; background:#fef3c7; padding:2px 6px; border-radius:6px; border:1px dashed #f59e0b;">⚠️ 重複收藏</span>\` : '';
        const badgeHtml = [tHtml, dupBadge].filter(Boolean).join(' ');

        const card = document.createElement('div');
        // 元素菇主題：從標籤偵測元素（優先順序：水晶 > 毒 > 水 > 火 > 電）
        const tag = (item.tag || '').toLowerCase();
        const n = (item.name || '').toLowerCase();
        const checkStr = tag + " " + n; // 容錯：標籤沒有的話，名稱有也算
        
        let elemClass = '';
        let elemHeaderBg = isExpired ? '#f3f4f6' : '#ecfdf5';
        let elemHeaderColor = isExpired ? '#6b7280' : '#065f46';
        let isElem = (item.kind === '元素菇' || item.type === '元素菇');

        // 如果名稱或標籤含有元素關鍵字，就算沒有設為元素菇也強制升級成元素菇
        if (checkStr.includes('水晶')) isElem = true;
        else if (checkStr.includes('毒')) isElem = true;
        else if (checkStr.includes('水') && !checkStr.includes('水果')) isElem = true;
        else if (checkStr.includes('火') || checkStr.includes('紅')) isElem = true;
        else if (checkStr.includes('電')) isElem = true;

        if (isElem) {
            if (checkStr.includes('水晶')) {
                elemClass = 'elem-水晶';
                elemHeaderBg = isExpired ? '#f3f4f6' : '#f5f3ff';
                elemHeaderColor = '#4c1d95';
            } else if (checkStr.includes('毒')) {
                elemClass = 'elem-毒';
                elemHeaderBg = isExpired ? '#f3f4f6' : '#f0f9ff';
                elemHeaderColor = '#3730a3';
            } else if (checkStr.includes('水') && !checkStr.includes('水果')) {
                elemClass = 'elem-水';
                elemHeaderBg = isExpired ? '#f3f4f6' : '#eff6ff';
                elemHeaderColor = '#1e40af';
            } else if (checkStr.includes('火') || checkStr.includes('紅')) {
                elemClass = 'elem-火';
                elemHeaderBg = isExpired ? '#f3f4f6' : '#fff1f2';
                elemHeaderColor = '#991b1b';
            } else if (checkStr.includes('電')) {
                elemClass = 'elem-電';
                elemHeaderBg = isExpired ? '#f3f4f6' : '#fffbeb';
                elemHeaderColor = '#92400e';
            } else {
                // 元素菇但標籤沒指定元素
                elemHeaderBg = isExpired ? '#f3f4f6' : '#d1fae5';
                elemHeaderColor = '#065f46';
            }
        }

        const dupClass = isDup ? 'duplicate-card' : '';
        const pinnedSet = getPinnedMushrooms();
        const isPinned = pinnedSet.has(item.id);
        card.className = \`grid-card \${isExpired ? 'row-expired' : ''} \${elemClass} \${dupClass} \${isPinned ? 'mush-pinned-card' : ''}\`.trim();
        card.style.position = 'relative';
        
        const uTheme = getUserColorTheme(item.user);

        const currentSlots = item.slots || ['', '', '', '', ''];
        const filledCount = currentSlots.filter(s => s !== '').length;
        const isFull = filledCount === 5;

        // 參戰空位：移除文字，將「滿」按鈕置右，保留 5 個圈圈
        let slotsHtml = \`<div class="slots-wrapper" style="background:transparent; border:none; padding:4px 0 0 0; margin-top:4px;">\`;
        if (!isFull) {
            slotsHtml += \`<div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom:6px; min-height:16px;">\`;
            slotsHtml += \`<button onclick="fillAllSlots('\${item.id}')" style="font-size:10px; font-weight:bold; background:#ef4444; color:white; border:none; border-radius:8px; padding:2px 8px; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.1);">滿</button>\`;
            slotsHtml += \`</div>\`;
        } else {
            slotsHtml += \`<div style="margin-bottom:6px; min-height:16px;"></div>\`; // 保持高度一致
        }
        slotsHtml += \`<div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">\`;
        for (let i = 0; i < 5; i++) {
            if (currentSlots[i]) {
                slotsHtml += \`<button class="slot-btn" style="flex:1; max-width:34px; aspect-ratio:1/1; height:auto; padding:0; border-radius:50%; background:#10b981; border:none; color:white; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onclick="toggleSlot('\${item.id}', \${i})">✓</button>\`;
            } else {
                slotsHtml += \`<button class="slot-btn" style="flex:1; max-width:34px; aspect-ratio:1/1; height:auto; padding:0; border-radius:50%; background:#f1f5f9; border:1px solid #cbd5e1; color:#94a3b8; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-sizing:border-box;" onclick="toggleSlot('\${item.id}', \${i})">+</button>\`;
            }
        }
        slotsHtml += \`</div></div>\`;

        // 元素圖示
        const elemEmoji = elemClass === 'elem-水' ? '💧' : elemClass === 'elem-火' ? '🔥' : elemClass === 'elem-電' ? '⚡' : elemClass === 'elem-毒' ? '☠️' : elemClass === 'elem-水晶' ? '💎' : '';
        const kindLabel = isElem ? \`元素\${elemEmoji}\` : '巨';
        const kindBg = isElem ? elemHeaderBg : '#fef3c7';
        const kindColor = isElem ? elemHeaderColor : '#92400e';

        const locHtml = badgeHtml ? \`<div style="display:flex; align-items:center; flex-wrap:wrap; gap:3px; margin-top:3px; font-size:11px;">\${badgeHtml}</div>\` : '';

        // 地圖/修改：縮小；複製：保持明顯（flex:1.5 讓它更寬）
        const actionBtnStyle = "flex:1; background:#f8fafc; border:1px solid #e2e8f0; color:#475569; font-size:16px; padding:4px 0; border-radius:10px; cursor:pointer; display:flex; justify-content:center; align-items:center; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:all 0.2s;";
        const copyBtnStyle  = "flex:1.5; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; font-size:22px; padding:6px 0; border-radius:10px; cursor:pointer; display:flex; justify-content:center; align-items:center; box-shadow:0 1px 3px rgba(59,130,246,0.2); transition:all 0.2s;";
        let actionHtml = '';
        actionHtml += item.coords ? \`<button class="btn-sm btn-default" style="\${actionBtnStyle}" onclick="goToMapCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}')"; title="地圖">🗺️</button>\` : '';
        actionHtml += \`<button class="btn-sm btn-edit" style="\${actionBtnStyle}" onclick="openTimeModalById('\${item.id}', 'mushroom')" title="修改">✏️</button>\`;
        actionHtml += item.coords ? \`<button class="btn-sm btn-default" style="\${copyBtnStyle}" onclick="copyCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}', this, true)" title="複製座標">📋</button>\` : '';

        card.innerHTML = \`
            <div style="background: \${elemHeaderBg}; padding: 6px 10px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 4px; min-width:0;">
                <div style="display:flex; align-items:center; gap:5px; flex-shrink:0;">
                    <span style="font-size: 18px; font-weight: 900; color: var(--text-main); white-space:nowrap; line-height:1;">#\${String(item.sn).padStart(2,'0')}</span>
                    <span style="font-size:11px; font-weight:900; padding:2px 8px; border-radius:6px; white-space:nowrap; background:\${kindBg}; color:\${kindColor}; line-height:1; border:1px solid \${kindColor}22;">\${kindLabel}</span>
                    \${cHtml}
                </div>
                <div style="display:flex; align-items:center; gap:4px; min-width:0;">
                    <span class="lc-time \${!isExpired && item.targetTime != null ? 'safe' : ''}" style="margin:0; font-size:10px; line-height:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0;">\${timeText}</span>
                    <button class="pin-btn \${isPinned ? 'pinned' : ''}" onclick="toggleMushPin('\${item.id}')" title="\${isPinned ? '取消重點標記' : '加入重點標記'}" style="flex-shrink:0;">\${isPinned ? '★' : '☆'}</button>
                </div>
            </div>
            <div class="card-body" style="gap: 8px; padding: 12px; display:flex; flex-direction:column; flex:1;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="flex:0 0 52px; display:flex; flex-direction:column; align-items:flex-start;">
                        \${item.user ? \`
                        <div style="background:\${uTheme.bg}; color:\${uTheme.color}; font-weight:\${uTheme.fw}; font-family:\${uTheme.ff}; border-radius:50%; width:52px; height:52px; display:flex; align-items:center; justify-content:center; line-height:1; text-align:center; overflow:hidden; border: 2px solid \${uTheme.border}; box-shadow: 0 2px 4px rgba(0,0,0,0.05); flex-shrink:0; \${uTheme.bgImg ? \`background-image:\${uTheme.bgImg}; background-size:\${uTheme.bgSize}; background-position:\${uTheme.bgPos}; background-repeat:no-repeat;\` : ''}">
                            <span style="font-size:14px; word-break:break-all; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; padding:0 2px;">\${escapeHtml(item.user)}</span>
                        </div>
                        \` : \`
                        <button onclick="openClaimModalById('\${item.id}')" style="background:linear-gradient(135deg, #60a5fa, #3b82f6); color:white; border:none; border-radius:50%; width:52px; height:52px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 6px rgba(59,130,246,0.3); transition:all 0.2s; flex-shrink:0; padding:0;">
                            <span style="font-size:16px; line-height:1; margin-bottom:2px; transform:translateY(1px);">🙋</span>
                            <span style="font-size:11px; font-weight:bold; line-height:1;">認領</span>
                        </button>
                        \`}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:3px; flex:1; min-width:0;">
                        <span class="card-title" style="font-size:16px; margin:0; line-height:1.3; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block;">\${safeName}</span>
                        \${locHtml}
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; margin-top:auto;">
                    \${slotsHtml}
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; border-top:1px solid #f1f5f9; padding-top:8px;">
                        <div style="display:flex; gap:8px; flex:1; justify-content:space-between;">\${actionHtml}</div>
                    </div>
                </div>
            </div>
            \${isFull ? \`<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; border-radius:12px; overflow:hidden;">
                <span style="font-size:72px; opacity:0.1; transform:rotate(-15deg); line-height:1; user-select:none;">🈵</span>
            </div>\` : ''}
        \`;
        return card;
    }`;

if (oldFuncRegex.test(js)) {
    js = js.replace(oldFuncRegex, newFunc);
    // bump version
    js = js.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.09.23.1610"');
    fs.writeFileSync('js/main.js', js);
    
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.09.23.1610"');
    html = html.replace(/v=\d{10,14}/g, 'v=202609231610');
    fs.writeFileSync('index.html', html);
    console.log('Success');
} else {
    console.log('Function not found!');
}

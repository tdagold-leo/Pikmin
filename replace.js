const fs = require('fs');

const target = `        const actionBtnStyle = "flex:1; background:#f8fafc; border:1px solid #e2e8f0; color:#475569; font-size:20px; padding:6px 0; border-radius:12px; cursor:pointer; display:flex; justify-content:center; align-items:center; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:all 0.2s;";
        let actionHtml = item.user === "" ? \`<button class="btn-sm btn-claim" style="flex:1.5; padding:6px 0; border-radius:12px; font-size:14px; display:flex; justify-content:center; align-items:center; margin:0;" onclick="openClaimModalById('\${item.id}')">🙋 認領</button>\` : '';
        actionHtml += item.coords ? \`<button class="btn-sm btn-default" style="\${actionBtnStyle}" onclick="goToMapCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}')" title="地圖">🗺️</button>\` : '';
        actionHtml += \`<button class="btn-sm btn-edit" style="\${actionBtnStyle}" onclick="openTimeModalById('\${item.id}', 'mushroom')" title="修改">✏️</button>\`;
        actionHtml += item.coords ? \`<button class="btn-sm btn-default" style="\${actionBtnStyle}" onclick="copyCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}', this, true)" title="複製座標">📋</button>\` : '';

        card.innerHTML = \`
            <div style="background: \${elemHeaderBg}; padding: 6px 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size: 11px; font-weight: bold; color: var(--text-muted); white-space:nowrap; line-height:1;">#\${String(item.sn).padStart(2,'0')}</span>
                    <span style="font-size:11px; font-weight:900; padding:2px 8px; border-radius:6px; white-space:nowrap; background:\${kindBg}; color:\${kindColor}; line-height:1; border:1px solid \${kindColor}22;">\${kindLabel}</span>
                </div>
                <span class="lc-time \${!isExpired && item.targetTime != null ? 'safe' : ''}" style="margin: 0; font-size: 10px; line-height:1;">\${timeText}</span>
            </div>
            <div class="card-body" style="gap: 8px; padding: 12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <div style="display:flex; flex-direction:column; gap:4px; flex:1; min-width:0;">
                        <span class="card-title" style="font-size:16px; margin:0; line-height:1.3; font-weight:bold;">\${safeName}</span>
                        \${locHtml}
                    </div>
                    <div style="flex:0 0 52px; display:flex; flex-direction:column; align-items:flex-end;">
                        <div style="background:\${uTheme.bg}; color:\${uTheme.color}; font-weight:\${uTheme.fw}; font-family:\${uTheme.ff}; border-radius:50%; width:52px; height:52px; display:flex; align-items:center; justify-content:center; line-height:1; text-align:center; overflow:hidden; border: 2px solid \${uTheme.border}; box-shadow: 0 2px 4px rgba(0,0,0,0.05); flex-shrink:0; \${uTheme.bgImg ? \`background-image:\${uTheme.bgImg}; background-size:\${uTheme.bgSize}; background-position:\${uTheme.bgPos}; background-repeat:no-repeat;\` : ''}">
                            \${item.user ? \`<span style="font-size:14px; word-break:break-all; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; padding:0 2px;">\${escapeHtml(item.user)}</span>\` : \`<span style="color:#64748b; font-size:11px; font-style:italic;">待認領</span>\`}
                        </div>
                    </div>
                </div>
                \${slotsHtml}
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; border-top:1px solid #f1f5f9; padding-top:8px;">
                    <div style="display:flex; gap:8px; flex:1; justify-content:space-between;">\${actionHtml}</div>
                </div>
            </div>
\`;
`;

const replacement = `        const actionBtnStyle = "flex:1; background:#f8fafc; border:1px solid #e2e8f0; color:#475569; font-size:20px; padding:6px 0; border-radius:12px; cursor:pointer; display:flex; justify-content:center; align-items:center; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:all 0.2s;";
        let actionHtml = '';
        actionHtml += item.coords ? \`<button class="btn-sm btn-default" style="\${actionBtnStyle}" onclick="goToMapCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}')" title="地圖">🗺️</button>\` : '';
        actionHtml += \`<button class="btn-sm btn-edit" style="\${actionBtnStyle}" onclick="openTimeModalById('\${item.id}', 'mushroom')" title="修改">✏️</button>\`;
        actionHtml += item.coords ? \`<button class="btn-sm btn-default" style="\${actionBtnStyle}" onclick="copyCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}', this, true)" title="複製座標">📋</button>\` : '';

        card.innerHTML = \`
            <div style="background: \${elemHeaderBg}; padding: 6px 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size: 11px; font-weight: bold; color: var(--text-muted); white-space:nowrap; line-height:1;">#\${String(item.sn).padStart(2,'0')}</span>
                    <span style="font-size:11px; font-weight:900; padding:2px 8px; border-radius:6px; white-space:nowrap; background:\${kindBg}; color:\${kindColor}; line-height:1; border:1px solid \${kindColor}22;">\${kindLabel}</span>
                </div>
                <span class="lc-time \${!isExpired && item.targetTime != null ? 'safe' : ''}" style="margin: 0; font-size: 10px; line-height:1;">\${timeText}</span>
            </div>
            <div class="card-body" style="gap: 8px; padding: 12px; display:flex; flex-direction:column; flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <div style="display:flex; flex-direction:column; gap:4px; flex:1; min-width:0;">
                        <span class="card-title" style="font-size:16px; margin:0; line-height:1.3; font-weight:bold;">\${safeName}</span>
                        \${locHtml}
                    </div>
                    <div style="flex:0 0 52px; display:flex; flex-direction:column; align-items:flex-end;">
                        \${item.user ? \`
                        <div style="background:\${uTheme.bg}; color:\${uTheme.color}; font-weight:\${uTheme.fw}; font-family:\${uTheme.ff}; border-radius:50%; width:52px; height:52px; display:flex; align-items:center; justify-content:center; line-height:1; text-align:center; overflow:hidden; border: 2px solid \${uTheme.border}; box-shadow: 0 2px 4px rgba(0,0,0,0.05); flex-shrink:0; \${uTheme.bgImg ? \\\`background-image:\${uTheme.bgImg}; background-size:\${uTheme.bgSize}; background-position:\${uTheme.bgPos}; background-repeat:no-repeat;\\\` : ''}">
                            <span style="font-size:14px; word-break:break-all; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; padding:0 2px;">\${escapeHtml(item.user)}</span>
                        </div>
                        \` : \`
                        <button onclick="openClaimModalById('\${item.id}')" style="background:linear-gradient(135deg, #60a5fa, #3b82f6); color:white; border:none; border-radius:50%; width:52px; height:52px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 6px rgba(59,130,246,0.3); transition:all 0.2s; flex-shrink:0; padding:0;">
                            <span style="font-size:16px; line-height:1; margin-bottom:2px; transform:translateY(1px);">🙋</span>
                            <span style="font-size:11px; font-weight:bold; line-height:1;">認領</span>
                        </button>
                        \`}
                    </div>
                </div>
                \${slotsHtml}
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; border-top:1px solid #f1f5f9; padding-top:8px;">
                    <div style="display:flex; gap:8px; flex:1; justify-content:space-between;">\${actionHtml}</div>
                </div>
            </div>
\`;
`;

let jsContent = fs.readFileSync('js/main.js', 'utf8');

// The file might use \r\n or \n
const normalize = str => str.replace(/\r\n/g, '\n').trim();

const normalizedTarget = normalize(target);
const normalizedJsContent = normalize(jsContent);
const startIdx = normalizedJsContent.indexOf(normalizedTarget.substring(0, 50));

if (startIdx === -1) {
    console.log("Could not find target to replace.");
} else {
    // Just find the start index of the match and replace
    const exactStartIdx = jsContent.indexOf('        const actionBtnStyle =');
    const exactEndIdx = jsContent.indexOf('            ${isFull ? `<div style="position:absolute; inset:0;');
    
    if (exactStartIdx !== -1 && exactEndIdx !== -1) {
        const newJs = jsContent.substring(0, exactStartIdx) + replacement + jsContent.substring(exactEndIdx);
        fs.writeFileSync('js/main.js', newJs);
        console.log("Replacement successful!");
    } else {
        console.log("Exact indices not found.");
    }
}

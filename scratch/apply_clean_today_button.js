const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. Replace sgDateBadge logic
const targetSnippet = `            let sgDateBadge = '';
            if (item.type === '特殊金盆' && item.sgType === '期間' && (item.sgStart || item.sgEnd)) {
                let s = item.sgStart || '未定';
                let e = item.sgEnd || '未定';
                sgDateBadge = \`<div style="color: #6d28d9; font-size: 10px; font-weight: bold; margin-top: 4px; background: #f5f3ff; padding: 4px 6px; border-radius: 4px; border: 1px dashed #8b5cf6; text-align: center;">📅 期間：\${s} ~ \${e}</div>\`;
                
                if (item.sgCooldown) {
                    let hasStarted = true;
                    if (item.sgStart) {
                        const startDate = new Date(item.sgStart + 'T00:00:00');
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        if (startDate > today) hasStarted = false;
                    }

                    if (!hasStarted) {
                        sgDateBadge += \`<div style="color: #b45309; font-size: 11px; font-weight: bold; margin-top: 6px; background: #fef3c7; padding: 4px 8px; border-radius: 6px; border: 1px solid #fde68a; text-align: center; letter-spacing:0.5px;">⏳ 尚未開始</div>\`;
                    } else if (!item.sgLast) {
                        sgDateBadge += \`<div style="display:flex; gap:6px; align-items:center; margin-top:6px;">
                            <div style="flex:1; color: #15803d; font-size: 11px; font-weight: bold; background: #dcfce7; padding: 5px 6px; border-radius: 6px; border: 1px solid #86efac; text-align: center;">✅ 可領取！</div>
                            <button type="button" onclick="markPostcardClaimedToday('\${item.id}', event)" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 3px; white-space: nowrap;">🎁 今日領取</button>
                        </div>\`;
                    } else {
                        const lastDate = new Date(item.sgLast + 'T00:00:00');
                        const nextDate = parseInt(item.sgCooldown, 10) === 30 ? new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate()) : new Date(lastDate.getTime() + parseInt(item.sgCooldown, 10) * 86400000);
                        const nextStr = \`\${nextDate.getFullYear()}/\${String(nextDate.getMonth()+1).padStart(2,'0')}/\${String(nextDate.getDate()).padStart(2,'0')}\`;
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        if (nextDate <= today) {
                            sgDateBadge += \`<div style="display:flex; gap:6px; align-items:center; margin-top:6px;">
                                <div style="flex:1; color: #15803d; font-size: 11px; font-weight: bold; background: #dcfce7; padding: 5px 6px; border-radius: 6px; border: 1px solid #86efac; text-align: center;">✅ 可領取！</div>
                                <button type="button" onclick="markPostcardClaimedToday('\${item.id}', event)" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 3px; white-space: nowrap;">🎁 今日領取</button>
                            </div>\`;
                        } else {
                            sgDateBadge += \`<div style="display:flex; gap:6px; align-items:center; margin-top:6px;">
                                <div style="flex:1; color: #0369a1; font-size: 11px; font-weight: bold; background: #e0f2fe; padding: 5px 6px; border-radius: 6px; border: 1px solid #bae6fd; text-align: center;">⏳ 下次：\${nextStr}</div>
                                <button type="button" onclick="markPostcardClaimedToday('\${item.id}', event)" title="重新設定為今日已領" style="background: #f8fafc; color: #64748b; border: 1px solid #cbd5e1; padding: 5px 8px; border-radius: 6px; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 3px; white-space: nowrap;">✓ 今日已領</button>
                            </div>\`;
                        }
                    }
                }
            }`;

const oldRegex = /let sgDateBadge = '';[\s\S]*?sgDateBadge \+= `<div style="color: #0369a1[\s\S]*?<\/div>`;\s*}\s*}\s*}/;

if (oldRegex.test(mainJs)) {
    mainJs = mainJs.replace(oldRegex, targetSnippet);
    console.log("Successfully replaced sgDateBadge logic");
} else {
    console.error("Could not find old sgDateBadge regex");
}

// 2. Ensure markPostcardClaimedToday exists at end of file
if (!mainJs.includes('function markPostcardClaimedToday')) {
    mainJs += `

    function markPostcardClaimedToday(id, e) {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayStr = \`\${y}-\${m}-\${d}\`;
        
        try {
            let personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
            personal[id] = todayStr;
            localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
            if (typeof currentSyncId !== 'undefined' && currentSyncId) {
                dbRef('user_sg_last/' + currentSyncId).set(personal);
            }
        } catch(err){}
        
        const foundPc = (typeof postcardList !== 'undefined' ? postcardList : []).find(x => x.id === id);
        if (foundPc) foundPc.sgLast = todayStr;
        
        updateView();
    }
    window.markPostcardClaimedToday = markPostcardClaimedToday;
`;
    console.log("Appended markPostcardClaimedToday");
}

fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

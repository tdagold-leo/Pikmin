const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace(/\r\n/g, '\n');

// Update _doUpdateView tItems loop
const tItemsTarget = `                                if (sepMatch) {
                                    const sepIdx = rawAct.indexOf(sepMatch[0]);
                                    mainAct = rawAct.substring(0, sepIdx).trim();
                                    subAct = rawAct.substring(sepIdx + sepMatch[0].length).trim();
                                    }
                                }
                                
                                if (!mainActMap[mainAct]) { mainActMap[mainAct] = {}; mainActOrder.push(mainAct); }`;
const tItemsReplace = `                                if (sepMatch) {
                                    const sepIdx = rawAct.indexOf(sepMatch[0]);
                                    mainAct = rawAct.substring(0, sepIdx).trim();
                                    subAct = rawAct.substring(sepIdx + sepMatch[0].length).trim();
                                    }
                                }
                                item._computedMainAct = mainAct;
                                item._computedSubAct = subAct;
                                
                                if (!mainActMap[mainAct]) { mainActMap[mainAct] = {}; mainActOrder.push(mainAct); }`;
if (js.includes(tItemsTarget)) {
    js = js.replace(tItemsTarget, tItemsReplace);
    console.log('tItems loop patched');
}

// Update group buttons in _doUpdateView
const groupBtnTarget = `                                    const allDiscontinued = itemsList.length > 0 && itemsList.every(item => item._localIsDisc);
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
                                    \`;`;
const groupBtnReplace = `                                    const allDiscontinued = itemsList.length > 0 && itemsList.every(item => item._localIsDisc);
                                    const groupClaimBtnHtml = allDiscontinued ? '' : \`
                                        <button type="button" class="group-claim-btn \${!hasClaimable ? 'claimed' : ''}" 
                                                onclick="markGroupClaimedToday('\${escapeHtml(mainAct).replace(/'/g, "\\\\'")}', '\${escapeHtml(subAct).replace(/'/g, "\\\\'")}', event)" 
                                                title="一鍵將群組內所有卡片設為今日已領">
                                            \${!hasClaimable ? '✓ 今日已領' : '🎁 今日領取'}
                                        </button>
                                    \`;
                                    
                                    const groupCopyBtnHtml = \`
                                        <button type="button" class="group-claim-btn claimed"
                                                onclick="copyGroupCoords('\${escapeHtml(mainAct).replace(/'/g, "\\\\'")}', '\${escapeHtml(subAct).replace(/'/g, "\\\\'")}', event)"
                                                title="一鍵複製群組內所有座標">
                                            📋 複製座標
                                        </button>
                                    \`;`;
if (js.includes(groupBtnTarget)) {
    js = js.replace(groupBtnTarget, groupBtnReplace);
    console.log('group buttons patched');
}

// Update markGroupClaimedToday
const markTarget = `    function markGroupClaimedToday(actName, e) {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayStr = \`\${y}-\${m}-\${d}\`;
        
        let personal = {};
        try {
            personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
        } catch(err){}

        let count = 0;
        const changed = {};
        postcardList.forEach(item => {
            const itemAct = (item.sgActivity || item.tag || '未分類').trim();
            if (itemAct === actName && item.type === '特殊金盆') {
                item.sgLast = todayStr;
                personal[item.id] = todayStr;
                changed[item.id] = todayStr;
                count++;
            }
        });`;
const markReplace = `    function markGroupClaimedToday(mainAct, subAct, e) {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayStr = \`\${y}-\${m}-\${d}\`;
        
        let personal = {};
        try {
            personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
        } catch(err){}

        let count = 0;
        const changed = {};
        postcardList.forEach(item => {
            if (item.type === '特殊金盆' && item._computedMainAct === mainAct && item._computedSubAct === subAct) {
                item.sgLast = todayStr;
                personal[item.id] = todayStr;
                changed[item.id] = todayStr;
                count++;
            }
        });`;
if (js.includes(markTarget)) {
    js = js.replace(markTarget, markReplace);
    console.log('markGroupClaimedToday patched');
}

// Update copyGroupCoords
const copyTarget = `    function copyGroupCoords(actName, e) {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        const btn = e && (e.currentTarget || e.target);
        const os = detectOS();
        const lines = [];
        postcardList.forEach(item => {
            const itemAct = (item.sgActivity || item.tag || '未分類').trim();
            if (itemAct === actName && item.type === '特殊金盆' && item.coords) {
                const normalized = normalizeCoords(String(item.coords));
                lines.push((os === 'ios' || os === 'macos' || os === 'windows') ? normalized.replace(/,/g, ' ') : normalized);
            }
        });`;
const copyReplace = `    function copyGroupCoords(mainAct, subAct, e) {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        const btn = e && (e.currentTarget || e.target);
        const os = detectOS();
        const lines = [];
        postcardList.forEach(item => {
            if (item.type === '特殊金盆' && item._computedMainAct === mainAct && item._computedSubAct === subAct && item.coords) {
                const normalized = normalizeCoords(String(item.coords));
                lines.push((os === 'ios' || os === 'macos' || os === 'windows') ? normalized.replace(/,/g, ' ') : normalized);
            }
        });`;
if (js.includes(copyTarget)) {
    js = js.replace(copyTarget, copyReplace);
    console.log('copyGroupCoords patched');
}

js = js.replace(/v=\d{10,14}/g, 'v=202610110335');
fs.writeFileSync('js/main.js', js);
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/v=\d{10,14}/g, 'v=202610110335');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.11.0335"');
fs.writeFileSync('index.html', html);
console.log('Done.');

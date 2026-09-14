const fs = require('fs');

let jsContent = fs.readFileSync('js/main.js', 'utf8');

const targetPostcard = `                const gHead = document.createElement('div');
                gHead.className = 'group-header postcard-header';
                if (typeof getColorForType === 'function') {
                    gHead.style.background = getColorForType(type);
                }
                
                let hasMissingGroup = false;
                let hasClaimableGroup = false;
                pcGroups[type].forEach(item => {
                    if ((item.tag || '').includes('缺') || (item.name || '').includes('缺') || (item.note || '').includes('缺') || (item.user || '').includes('缺')) {
                        hasMissingGroup = true;
                    }
                    if (item.type === '特殊金盆') {
                        let cdVal = item.sgCooldown;
                        if (!cdVal && item.tag && (item.tag.includes('30天') || item.tag.includes('30 天') || item.tag.includes('一個月') || item.tag.includes('30 days'))) cdVal = '30';
                        if (!cdVal && (item.sgType === '期間' || item.sgType === '常駐')) cdVal = '30';
                        if (cdVal && !item.discontinued) {
                            let hasStarted = true;
                            if (item.sgType === '期間' && item.sgStart) {
                                const startDate = new Date(item.sgStart + 'T00:00:00');
                                const today = new Date();
                                today.setHours(0,0,0,0);
                                if (startDate > today) hasStarted = false;
                            }
                            if (hasStarted) {
                                if (!item.sgLast) hasClaimableGroup = true;
                                else {
                                    const lastDate = new Date(item.sgLast + 'T00:00:00');
                                    const nextDate = parseInt(cdVal, 10) === 30 ? new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate()) : new Date(lastDate.getTime() + parseInt(cdVal, 10) * 86400000);
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    if (nextDate <= today) hasClaimableGroup = true;
                                }
                            }
                        }
                    }
                });

                let groupReminders = '';
                if (hasMissingGroup) groupReminders += ' <span style="color:#fee2e2; font-size:12px; font-weight:bold; background:rgba(239,68,68,0.3); padding:1px 6px; border-radius:10px; margin-left:4px;">❗缺</span>';
                if (hasClaimableGroup) groupReminders += ' <span style="color:#fef3c7; font-size:12px; font-weight:bold; background:rgba(217,119,6,0.3); padding:1px 6px; border-radius:10px; margin-left:4px;">⚠️可拿</span>';

                gHead.innerHTML = \`
                    <span style="font-size:18px; font-weight:900; background:rgba(255,255,255,0.25); padding:4px 12px; border-radius:16px;">\${pcGroups[type].length} 筆</span> 
                    <span>\${arrow} 📂 \${escapeHtml(type)}\${groupReminders}</span>
                \`;`;

const replacementPostcard = `                const gHead = document.createElement('div');
                gHead.className = 'group-header';
                gHead.style.background = 'transparent';
                gHead.style.boxShadow = 'none';
                gHead.style.justifyContent = 'flex-start';
                gHead.style.padding = '4px 0';
                gHead.style.marginTop = '16px';

                let hash = 0;
                for (let i = 0; i < type.length; i++) hash = type.charCodeAt(i) + ((hash << 5) - hash);
                const hue = Math.abs(hash) % 360;
                const pastelBg = \`hsl(\${hue}, 85%, 94%)\`;
                const darkText = \`hsl(\${hue}, 85%, 30%)\`;
                const borderColor = \`hsl(\${hue}, 85%, 85%)\`;
                
                let hasMissingGroup = false;
                let hasClaimableGroup = false;
                pcGroups[type].forEach(item => {
                    if ((item.tag || '').includes('缺') || (item.name || '').includes('缺') || (item.note || '').includes('缺') || (item.user || '').includes('缺')) {
                        hasMissingGroup = true;
                    }
                    if (item.type === '特殊金盆') {
                        let cdVal = item.sgCooldown;
                        if (!cdVal && item.tag && (item.tag.includes('30天') || item.tag.includes('30 天') || item.tag.includes('一個月') || item.tag.includes('30 days'))) cdVal = '30';
                        if (!cdVal && (item.sgType === '期間' || item.sgType === '常駐')) cdVal = '30';
                        if (cdVal && !item.discontinued) {
                            let hasStarted = true;
                            if (item.sgType === '期間' && item.sgStart) {
                                const startDate = new Date(item.sgStart + 'T00:00:00');
                                const today = new Date();
                                today.setHours(0,0,0,0);
                                if (startDate > today) hasStarted = false;
                            }
                            if (hasStarted) {
                                if (!item.sgLast) hasClaimableGroup = true;
                                else {
                                    const lastDate = new Date(item.sgLast + 'T00:00:00');
                                    const nextDate = parseInt(cdVal, 10) === 30 ? new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate()) : new Date(lastDate.getTime() + parseInt(cdVal, 10) * 86400000);
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    if (nextDate <= today) hasClaimableGroup = true;
                                }
                            }
                        }
                    }
                });

                let groupReminders = '';
                if (hasMissingGroup) groupReminders += ' <span style="color:#dc2626; font-size:12px; font-weight:bold; background:#fef2f2; border:1px solid #fca5a5; padding:2px 8px; border-radius:12px; margin-left:8px;">⚠️ 缺</span>';
                if (hasClaimableGroup) groupReminders += ' <span style="color:#d97706; font-size:12px; font-weight:bold; background:#fffbeb; border:1px solid #fcd34d; padding:2px 8px; border-radius:12px; margin-left:8px;">🎁 可拿</span>';

                gHead.innerHTML = \`
                    <div style="background:\${pastelBg}; border:1px solid \${borderColor}; color:\${darkText}; padding:6px 14px; border-radius:16px; display:inline-flex; align-items:center; gap:10px; font-size:16px; font-weight:bold; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:all 0.2s;">
                        <span>\${arrow} 📂 \${escapeHtml(type)}</span>
                        <span style="background:rgba(255,255,255,0.7); padding:2px 8px; border-radius:12px; font-size:13px; font-weight:900;">\${pcGroups[type].length} 筆</span>
                    </div>\${groupReminders}
                \`;`;

const normalize = str => str.replace(/\r\n/g, '\n').trim();

if (normalize(jsContent).indexOf(normalize(targetPostcard).substring(0, 50)) !== -1) {
    const startIdx = jsContent.indexOf("const gHead = document.createElement('div');");
    // Find the right startIdx for postcard
    const idx = jsContent.indexOf("gHead.className = 'group-header postcard-header';");
    const actualStartIdx = jsContent.lastIndexOf("const gHead = document.createElement('div');", idx);
    const endIdx = jsContent.indexOf("gHead.addEventListener('click', () => toggleGroup(groupId));", idx);
    
    if(actualStartIdx !== -1 && endIdx !== -1) {
        jsContent = jsContent.substring(0, actualStartIdx) + replacementPostcard + '\n\n                ' + jsContent.substring(endIdx);
        console.log('Postcard replaced');
    }
}

// Now replace mushroom header
const idxM = jsContent.indexOf("gHead.className = 'group-header mushroom-header';");
if (idxM !== -1) {
    const startM = jsContent.lastIndexOf("const gHead = document.createElement('div');", idxM);
    const endM = jsContent.indexOf("gHead.addEventListener('click'", idxM);
    
    const replacementMushroom = `const gHead = document.createElement('div');
        gHead.className = 'group-header';
        gHead.style.background = 'transparent';
        gHead.style.boxShadow = 'none';
        gHead.style.justifyContent = 'flex-start';
        gHead.style.padding = '4px 0';
        gHead.style.marginTop = '16px';
        gHead.innerHTML = \`
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:6px 14px; border-radius:16px; display:inline-flex; align-items:center; gap:10px; font-size:16px; font-weight:bold; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                <span>\${arrow} 📂 \${escapeHtml(title)}</span>
                <span style="background:rgba(255,255,255,0.8); padding:2px 8px; border-radius:12px; font-size:13px; font-weight:900;">\${cards.length} 筆</span>
            </div>
        \`;\n        `;
        
    jsContent = jsContent.substring(0, startM) + replacementMushroom + jsContent.substring(endM);
    console.log('Mushroom replaced');
}

fs.writeFileSync('js/main.js', jsContent);

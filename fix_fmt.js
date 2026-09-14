const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const target = `        const formatLineText = (i, isUnclaimed) => {
            const currentSlots = i.slots || ['', '', '', '', ''];
            const filledCount = currentSlots.filter(s => s !== '').length;
            const emptyCount = 5 - filledCount;
            const slotIcon = emptyCount === 0 ? '🈵額滿' : \`空\${emptyCount}位\`;

            const sn = String(i.sn || '?').padStart(2, '0');
            const userName = isUnclaimed ? '待認領' : (i.user || '?').substring(0, 6);

            let timeStr;
            if (isUnclaimed) {
                timeStr = now >= i.midnightUTC ? '⚠️ 已換日過期' : \`🌙 換日倒數 \${getShortRemainingText(i.midnightUTC, now)}\`;
            } else {
                const rem = getShortRemainingText(i.targetTime, now);
                const isExp = i.targetTime != null && i.targetTime - now <= 0;
                timeStr = isExp ? '🔥 可開打！' : (i.targetTime == null ? '⏳ 尚未設定時間' : \`⏱ \${rem}\`);
            }

            const ke = kindEmoji(i.kind);
            const kl = kindLabel(i.kind);
            return \`\${ke} #\${sn}[\${kl}] \${slotIcon}｜👤 \${userName}｜\${timeStr}\`;
        };`;

const replacement = `        const formatLineText = (i, isUnclaimed) => {
            const currentSlots = i.slots || ['', '', '', '', ''];
            const filledCount = currentSlots.filter(s => s !== '').length;
            const emptyCount = 5 - filledCount;
            const slotIcon = emptyCount === 0 ? '🈵額滿' : \`🈳空\${emptyCount}位\`;

            const sn = String(i.sn || '?').padStart(2, '0');
            const userName = isUnclaimed ? '待認領' : (i.user || '?').substring(0, 6);
            
            const tagStr = i.tag ? \` 🏷️\${i.tag.trim()}\` : '';

            let timeStr;
            if (isUnclaimed) {
                timeStr = now >= i.midnightUTC ? '⚠️ 已換日' : \`🌙 \${getShortRemainingText(i.midnightUTC, now)}\`;
            } else {
                const rem = getShortRemainingText(i.targetTime, now);
                const isExp = i.targetTime != null && i.targetTime - now <= 0;
                timeStr = isExp ? '🔥可開打！' : (i.targetTime == null ? '⏳未設定' : \`⏱ \${rem}\`);
            }

            const ke = kindEmoji(i.kind);
            const kl = kindLabel(i.kind);
            return \`\${ke} #\${sn}[\${kl}]\${tagStr}｜\${slotIcon}｜👤\${userName}｜\${timeStr}\`;
        };`;

const normalize = s => s.replace(/\r\n/g, '\n').trim();

let startIdx = normalize(js).indexOf(normalize(target).substring(0, 100));

if (startIdx !== -1) {
    const s1 = js.indexOf('const formatLineText = (i, isUnclaimed) => {');
    const e1 = js.indexOf('};', s1 + 100) + 2;
    if (s1 !== -1 && e1 !== -1) {
        js = js.substring(0, s1) + replacement + js.substring(e1);
        fs.writeFileSync('js/main.js', js);
        console.log('Replaced successfully');
    }
} else {
    console.log('Target not found');
}

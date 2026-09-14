const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
const target = `        for (let i = 0; i < 5; i++) {
            if (currentSlots[i]) {
                slotsHtml += \`<button class="slot-btn" style="flex:1; max-width:44px; height:44px; padding:0; border-radius:50%; background:#10b981; border:none; color:white; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onclick="toggleSlot('\${item.id}', \${i})">✓</button>\`;
            } else {
                slotsHtml += \`<button class="slot-btn" style="flex:1; max-width:44px; height:44px; padding:0; border-radius:50%; background:#f1f5f9; border:1px solid #cbd5e1; color:#94a3b8; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-sizing:border-box;" onclick="toggleSlot('\${item.id}', \${i})">+</button>\`;
            }
        }`;

const replacement = `        for (let i = 0; i < 5; i++) {
            if (currentSlots[i]) {
                slotsHtml += \`<button class="slot-btn" style="flex:1; max-width:44px; aspect-ratio:1/1; height:auto; padding:0; border-radius:50%; background:#10b981; border:none; color:white; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onclick="toggleSlot('\${item.id}', \${i})">✓</button>\`;
            } else {
                slotsHtml += \`<button class="slot-btn" style="flex:1; max-width:44px; aspect-ratio:1/1; height:auto; padding:0; border-radius:50%; background:#f1f5f9; border:1px solid #cbd5e1; color:#94a3b8; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-sizing:border-box;" onclick="toggleSlot('\${item.id}', \${i})">+</button>\`;
            }
        }`;

const normalize = s => s.replace(/\r\n/g, '\n').trim();
const nTarget = normalize(target);
const startIdx = normalize(js).indexOf(nTarget.substring(0, 100));

if (startIdx !== -1) {
    const s1 = js.indexOf('for (let i = 0; i < 5; i++) {');
    const e1 = js.indexOf('slotsHtml += `</div></div>`;', s1);
    if (s1 !== -1 && e1 !== -1) {
        js = js.substring(0, s1) + replacement + '\n        ' + js.substring(e1);
        fs.writeFileSync('js/main.js', js);
        console.log('Slots fixed');
    }
} else {
    console.log('Target not found');
}

const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
const nl = js.includes('\r\n') ? '\r\n' : '\n';
function rep(a, b) {
  a = a.replace(/\n/g, nl); b = b.replace(/\n/g, nl);
  const idx = js.indexOf(a);
  if (idx < 0 || js.indexOf(a, idx + 1) >= 0) { console.error('NOT FOUND OR AMBIGUOUS:\n' + a.slice(0, 80)); process.exit(1); }
  js = js.replace(a, () => b);
}

// 1. copyGroupCoords function (before copyCoords)
rep(`    function copyCoords(text, buttonElement, isInline = false) {`, `    // 一鍵複製群組內所有座標（每行一筆，格式同 copyCoords）
    function copyGroupCoords(actName, e) {
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
        });
        if (lines.length === 0) { alert('此群組沒有座標可複製'); return; }
        navigator.clipboard.writeText(lines.join('\\n')).then(() => {
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '✅ 已複製 ' + lines.length + ' 筆';
                setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
            }
        }).catch(err => alert('複製失敗，請手動複製。'));
    }

    function copyCoords(text, buttonElement, isInline = false) {`);

// 2. group header button
rep(`                                    \${cooldownBadge}
                                    \${groupClaimBtnHtml}
                                \`;`, `                                    \${cooldownBadge}
                                    <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">\${groupClaimBtnHtml}\${groupCopyBtnHtml}</div>
                                \`;`);

rep(`                                ah.innerHTML = \`
                                    <div class="count">`, `                                const groupCopyBtnHtml = \`
                                    <button type="button" class="group-claim-btn claimed"
                                            onclick="copyGroupCoords('\${escapeHtml(act).replace(/'/g, "\\\\'")}', event)"
                                            title="一鍵複製群組內所有座標">
                                        📋 複製座標
                                    </button>
                                \`;

                                ah.innerHTML = \`
                                    <div class="count">`);

rep(`window.markGroupClaimedToday = markGroupClaimedToday;`, `window.markGroupClaimedToday = markGroupClaimedToday;
window.copyGroupCoords = copyGroupCoords;`);

fs.writeFileSync('js/main.js', js);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/const APP_VERSION = "[^"]+"/, 'const APP_VERSION = "2026.10.03.1555"');
html = html.replace(/v=\d{10,14}/g, 'v=202610031555');
fs.writeFileSync('index.html', html);
console.log('OK');

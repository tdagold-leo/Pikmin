const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const t1 = `    async function shareToLineWindow() {
        if (dataList.length === 0) { alert('目前沒有任何資訊可以分享喔！'); return; }
        const btn = document.querySelector('.line-share-btn');
        const originalText = btn.innerText;
        btn.innerText = '⏳ 正在產生分享內容...'; btn.disabled = true;`;

const r1 = `    async function shareToLineWindow() {
        if (dataList.length === 0) { alert('目前沒有任何資訊可以分享喔！'); return; }
        const btn = document.getElementById('line-share-btn');
        let originalHtml = '';
        if (btn) {
            originalHtml = btn.innerHTML;
            btn.innerHTML = '<span>⏳</span> 處理中...'; 
            btn.disabled = true;
        }`;

const t2 = `        out = out.trim();
        
        navigator.clipboard.writeText(out).catch(e => console.log(e));
        btn.innerText = '✅ 已複製並喚醒 LINE...';
        setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 2500);
        window.location.href = "https://line.me/R/msg/text/?" + encodeURIComponent(out);
    }`;

const r2 = `        out = out.trim();
        
        navigator.clipboard.writeText(out).catch(e => console.log(e));
        if (btn) {
            btn.innerHTML = '<span>✅</span> 開啟 LINE...';
            setTimeout(() => { btn.innerHTML = originalHtml; btn.disabled = false; }, 2500);
        }
        window.location.href = "https://line.me/R/msg/text/?" + encodeURIComponent(out);
    }`;

const normalize = s => s.replace(/\r\n/g, '\n').trim();

let start1 = normalize(js).indexOf(normalize(t1).substring(0, 100));
let start2 = normalize(js).indexOf(normalize(t2).substring(0, 100));

if (start1 !== -1 && start2 !== -1) {
    js = js.replace(t1, r1);
    js = js.replace(t2, r2);
    fs.writeFileSync('js/main.js', js);
    console.log('Replaced successfully');
} else {
    console.log('Target not found');
}

const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

js = js.replace(
    "const btn = document.querySelector('.line-share-btn');\n        const originalText = btn.innerText;\n        btn.innerText = '⏳ 正在產生分享內容...'; btn.disabled = true;",
    "const btn = document.getElementById('line-share-btn');\n        let originalHtml = '';\n        if (btn) {\n            originalHtml = btn.innerHTML;\n            btn.innerHTML = '<span>⏳</span> 處理中...'; \n            btn.disabled = true;\n        }"
);

js = js.replace(
    "btn.innerText = '✅ 已複製並喚醒 LINE...';\n        setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 2500);",
    "if (btn) {\n            btn.innerHTML = '<span>✅</span> 開啟 LINE...';\n            setTimeout(() => { btn.innerHTML = originalHtml; btn.disabled = false; }, 2500);\n        }"
);

fs.writeFileSync('js/main.js', js);

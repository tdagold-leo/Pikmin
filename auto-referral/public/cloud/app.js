const logContainer = document.getElementById('logContainer');
const startBtn = document.getElementById('startBtn');
const referralCodeInput = document.getElementById('referralCode');

// UI Elements
const emailBox = document.getElementById('emailBox');
const emailDisplay = document.getElementById('emailDisplay');
const copyEmailBtn = document.getElementById('copyEmailBtn');

const codeBox = document.getElementById('codeBox');
const codeDisplay = document.getElementById('codeDisplay');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const loadingBar = document.getElementById('loadingBar');

function log(msg, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${msg}`;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 擁有重試機制的 fetch
async function fetchWithRetry(url, options, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            log(`連線失敗 (${err.message})，正在重試 (${i + 1}/${maxRetries})...`, 'log-error');
            await sleep(2000);
        }
    }
    throw new Error('達到最大重試次數，網路連線失敗');
}

// 複製到剪貼簿功能
async function copyToClipboard(text, btnElement) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = btnElement.innerHTML;
        btnElement.classList.add('success');
        btnElement.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span>已複製！</span>
        `;
        setTimeout(() => {
            btnElement.classList.remove('success');
            btnElement.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        log(`複製失敗: ${err.message}`, 'log-error');
    }
}

// 主要邏輯
async function runAutomation() {
    startBtn.disabled = true;
    startBtn.textContent = "執行中...";
    emailBox.classList.remove('active');
    codeBox.classList.remove('active');
    logContainer.innerHTML = '';
    
    try {
        log('🚀 開始產生免洗信箱...');
        
        // 1. 取得網域
        const domainsRes = await fetchWithRetry('https://api.mail.tm/domains', { method: 'GET' });
        const domain = domainsRes['hydra:member'][0].domain;
        
        // 2. 產生帳號密碼
        const randomString = Date.now().toString();
        const address = `nintendo${randomString}@${domain}`;
        const password = 'Password123!';
        
        // 3. 註冊帳號
        await fetchWithRetry('https://api.mail.tm/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });
        
        // 4. 登入取得 Token
        const tokenRes = await fetchWithRetry('https://api.mail.tm/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });
        const token = tokenRes.token;
        
        log('✅ 成功取得信箱！', 'log-success');
        
        // 顯示信箱並綁定複製按鈕
        emailDisplay.textContent = address;
        emailBox.classList.add('active');
        copyEmailBtn.onclick = () => copyToClipboard(address, copyEmailBtn);
        
        log('📬 開始監聽任天堂驗證信...');
        codeBox.classList.add('active');
        loadingBar.style.display = 'block';
        codeDisplay.textContent = '--';
        document.querySelector('#codeBox .info-title').textContent = '任天堂驗證碼 (等待中...)';
        copyCodeBtn.disabled = true;
        copyCodeBtn.onclick = null;
        
        // 5. 輪詢信件
        let verificationCode = null;
        const maxAttempts = 30; // 10分鐘 (30 * 20秒)
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            log(`⏳ 等待信件中... (${attempt}/${maxAttempts})`);
            
            const msgsRes = await fetchWithRetry('https://api.mail.tm/messages', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const messages = msgsRes['hydra:member'];
            if (messages && messages.length > 0) {
                const mailId = messages[0].id;
                log('📧 收到信件了！正在讀取內容...');
                
                const mailRes = await fetchWithRetry(`https://api.mail.tm/messages/${mailId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const htmlContent = mailRes.html[0] || mailRes.text;
                const match = htmlContent.match(/\b(\d{4})\b/);
                
                if (match) {
                    verificationCode = match[1];
                    break;
                } else {
                    log('⚠️ 信件中沒有找到 4 位數驗證碼', 'log-error');
                }
            }
            
            await sleep(20000); // 每 20 秒檢查一次
        }
        
        if (verificationCode) {
            log(`✅ 成功取得驗證碼：${verificationCode}`, 'log-success');
            
            // 顯示驗證碼並綁定複製
            loadingBar.style.display = 'none';
            document.querySelector('#codeBox .info-title').textContent = '任天堂驗證碼 (點擊下方複製)';
            codeDisplay.textContent = verificationCode;
            copyCodeBtn.disabled = false;
            copyCodeBtn.onclick = () => copyToClipboard(verificationCode, copyCodeBtn);
            
            // 自動複製到剪貼簿 (如果瀏覽器允許)
            try {
                await navigator.clipboard.writeText(verificationCode);
                log('✅ 驗證碼已自動複製到剪貼簿！');
            } catch (e) {
                // 如果自動複製被阻擋，也沒關係，有按鈕可以按
            }
        } else {
            log('❌ 等待超時，請重新執行', 'log-error');
            loadingBar.style.display = 'none';
            document.querySelector('#codeBox .info-title').textContent = '等待超時';
        }
        
    } catch (err) {
        log(`❌ 發生錯誤: ${err.message}`, 'log-error');
    } finally {
        startBtn.disabled = false;
        startBtn.textContent = "再次產生新信箱";
    }
}

startBtn.addEventListener('click', runAutomation);

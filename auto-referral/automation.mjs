import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = util.promisify(exec);

/**
 * Pikmin Bloom 邀請碼自動化 - 純後端 API 版 (供手機手動註冊用)
 * 
 * 流程：僅產生 Mail.tm 信箱，等待使用者在手機上填寫，然後抓取驗證碼顯示。
 */

const DEFAULT_PASSWORD = 'password123';

async function sendToLine(text, onLog) {
    try {
        onLog(`  🤖 準備自動傳送到 LINE...`);
        onLog(`  ⚠️ 【請在 3 秒內點擊旁邊的 LINE 聊天視窗！】 腳本倒數 3 秒後將自動貼上並送出...`);
        
        // 使用專門編譯的 C# 工具，倒數 3 秒後自動貼上
        const pasterPath = path.join(__dirname, 'LinePaster.exe');
        await execAsync(`"${pasterPath}" "${text}"`);
        onLog(`  ✅ 已傳送至 LINE！`);
    } catch (e) {
        onLog(`  ⚠️ 傳送至 LINE 失敗: ${e.message}`);
    }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// 建立一個帶有重試機制的 fetch 函數
const fetchWithRetry = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (!res.ok && res.status !== 422) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res;
        } catch (err) {
            if (i === retries - 1) throw err;
            await sleep(2000);
        }
    }
};

export async function createOneAccount({ referralCode, onLog = console.log, headless = true }) {
    const result = { email: '', password: DEFAULT_PASSWORD, code: '', status: 'pending', error: '' };
    
    try {
        // ====== Step 1: 透過 Mail.tm API 取得臨時 Email ======
        onLog('📧 透過 Mail.tm API 產生專屬信箱...');
        let tempEmail = '';
        let token = '';
        
        try {
            const domainRes = await fetchWithRetry('https://api.mail.tm/domains');
            const domainData = await domainRes.json();
            const domain = domainData['hydra:member'][0].domain;
            
            tempEmail = 'nintendo' + Date.now() + '@' + domain;
            
            await fetchWithRetry('https://api.mail.tm/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: tempEmail, password: DEFAULT_PASSWORD })
            });
            
            const tokenRes = await fetchWithRetry('https://api.mail.tm/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: tempEmail, password: DEFAULT_PASSWORD })
            });
            const tokenData = await tokenRes.json();
            token = tokenData.token;
            
        } catch (e) {
            throw new Error(`Mail.tm API 呼叫失敗: ${e.message}`);
        }

        if (!tempEmail || !token) throw new Error('無法取得信箱');

        result.email = tempEmail;
        
        onLog(`\n==========================================`);
        onLog(`✅ 已成功產生信箱！`);
        onLog(`📝 請在你的手機上，使用以下信箱註冊任天堂帳號：`);
        onLog(`\n【 ${tempEmail} 】\n`);
        onLog(`==========================================\n`);
        
        // 自動傳送 Email 到 LINE
        await sendToLine(tempEmail, onLog);
        
        // ====== Step 2: 等待使用者在手機上送出表單 ======
        onLog('📬 正在監聽收件匣... 請在手機上送出表單！');
        
        let verificationCode = null;
        for (let i = 0; i < 30; i++) { // 延長等待時間至 10 分鐘，方便手動操作
            await sleep(20000);
            
            try {
                const checkRes = await fetchWithRetry('https://api.mail.tm/messages', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await checkRes.json();
                
                if (data && data['hydra:member'] && data['hydra:member'].length > 0) {
                    for (const msg of data['hydra:member']) {
                        const subject = msg.subject || '';
                        if (subject.includes('Nintendo') || subject.includes('nintendo') || subject.includes('驗證') || subject.includes('verify')) {
                            onLog('  📧 收到任天堂的信件了！');
                            
                            const subjectMatch = subject.match(/【(\d{4,6})】/);
                            if (subjectMatch) {
                                verificationCode = subjectMatch[1];
                            } else {
                                const mailRes = await fetchWithRetry(`https://api.mail.tm/messages/${msg.id}`, {
                                    headers: { 'Authorization': 'Bearer ' + token }
                                });
                                const mailData = await mailRes.json();
                                const mailBody = mailData.text || mailData.html || [];
                                const bodyContent = Array.isArray(mailBody) ? mailBody.join('') : mailBody;
                                
                                const codeMatch = bodyContent.match(/(?:確認碼|驗證碼|code|Code|コード)[^\d]*(\d{4,6})/i);
                                if (codeMatch) verificationCode = codeMatch[1];
                                else {
                                    const fallbackMatch = bodyContent.match(/\b([0-9]{4,6})\b/g);
                                    if (fallbackMatch && fallbackMatch.length > 0) {
                                        const filtered = fallbackMatch.filter(num => !/^(19|20)\d{2}$/.test(num));
                                        verificationCode = filtered.length > 0 ? filtered[0] : fallbackMatch[0];
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            } catch (e) {
                // 忽略錯誤，繼續輪詢
            }

            if (verificationCode) break;
            onLog(`  ⏳ 輪詢中... 等待手機送出表單 ${(i+1)*20}s / 600s`);
        }

        if (verificationCode) {
            result.code = verificationCode;
            result.status = 'success';
            onLog(`\n==========================================`);
            onLog(`✅ 成功取得驗證碼！`);
            onLog(`🔢 請將以下驗證碼輸入到你的手機上：`);
            onLog(`\n【 ${verificationCode} 】\n`);
            onLog(`==========================================\n`);
            
            // 自動傳送驗證碼到 LINE
            await sendToLine(verificationCode, onLog);
            
            // 緊接著自動傳送邀請碼到 LINE
            await sleep(1000); // 稍微停頓 1 秒
            onLog(`  🤖 準備自動傳送「邀請碼」到 LINE...`);
            onLog(`  ⚠️ 【請保持 LINE 視窗為作用中！】 腳本倒數 3 秒後將自動貼上邀請碼...`);
            await sendToLine(referralCode, onLog);
            
            onLog('🎉 任務完成！可以關閉此任務了。');
        } else {
            result.status = 'no_code';
            result.error = '等待超時，未收到驗證信。';
            onLog('⚠️ 等待超過 10 分鐘，未能取得驗證碼，任務結束。');
        }

    } catch (error) {
        result.status = 'error';
        result.error = error.message;
        onLog(`❌ 錯誤: ${error.message}`);
    }

    return result;
}

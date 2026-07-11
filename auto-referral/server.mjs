import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createOneAccount } from './automation.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Server-Sent Events (SSE) for live logging
let currentLogs = [];
let logClients = [];

function broadcastLog(msg) {
    const logStr = `[${new Date().toLocaleTimeString('zh-TW')}] ${msg}`;
    console.log(logStr);
    currentLogs.push(logStr);
    logClients.forEach(client => client.write(`data: ${JSON.stringify({ type: 'log', message: logStr })}\n\n`));
}

app.get('/api/logs', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send history
    currentLogs.forEach(log => {
        res.write(`data: ${JSON.stringify({ type: 'log', message: log })}\n\n`);
    });
    
    logClients.push(res);
    
    req.on('close', () => {
        logClients = logClients.filter(c => c !== res);
    });
});

app.post('/api/run', async (req, res) => {
    const { referralCode, count } = req.body;
    
    if (!referralCode || !count) {
        return res.status(400).json({ error: 'Missing referral code or count' });
    }
    
    currentLogs = []; // Reset logs for new run
    broadcastLog(`🚀 開始執行自動化任務 - 邀請碼: ${referralCode}, 執行次數: ${count}`);
    
    // We send an immediate response so the browser knows the task has started
    res.json({ status: 'started' });
    
    // Run the tasks sequentially in the background
    (async () => {
        const results = [];
        for (let i = 0; i < count; i++) {
            broadcastLog(`\n⏳ ===== 開始執行第 ${i + 1}/${count} 次 =====`);
            try {
                const result = await createOneAccount({
                    referralCode,
                    onLog: (msg) => {
                        if (msg.startsWith('EMAIL_READY:')) {
                            const email = msg.split(':')[1];
                            logClients.forEach(client => client.write(`data: ${JSON.stringify({ type: 'email_ready', index: i + 1, email })}\n\n`));
                        } else {
                            broadcastLog(msg);
                        }
                    },
                    headless: false // 取消背景執行，讓使用者能觀察網頁狀況
                });
                
                results.push(result);
                broadcastLog(`✅ 第 ${i + 1} 次執行完成: ${result.status === 'success' ? '成功' : '失敗/超時'}`);
                
                // Send result back via SSE
                logClients.forEach(client => client.write(`data: ${JSON.stringify({ type: 'result', index: i + 1, data: result })}\n\n`));
                
            } catch (error) {
                broadcastLog(`❌ 第 ${i + 1} 次執行發生錯誤: ${error.message}`);
                logClients.forEach(client => client.write(`data: ${JSON.stringify({ type: 'result', index: i + 1, data: { status: 'error', error: error.message } })}\n\n`));
            }
        }
        broadcastLog(`\n🎉 所有 ${count} 次任務執行完畢！`);
        logClients.forEach(client => client.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
    })();
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

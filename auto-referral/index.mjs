/**
 * Pikmin Bloom 邀請碼半自動化工具
 * 
 * 流程：
 * 1. 從 Guerrilla Mail API 取得臨時 Email
 * 2. 開啟 Nintendo 帳號註冊頁面
 * 3. 自動填寫註冊表單
 * 4. 自動從臨時信箱取得驗證碼
 * 5. 自動填入驗證碼完成註冊
 * 
 * 用法：node index.mjs [邀請碼]
 */

import { chromium } from 'playwright';
import * as readline from 'readline';

// ===== 設定區 =====
const CONFIG = {
    referralCode: process.argv[2] || 'PJFXDOHAL',
    password: 'Pikmin2026!',
    birthYear: '1990',
    birthMonth: '6',
    birthDay: '15',
    headed: true,
    slowMo: 200,
};

function log(msg) { console.log(`[${new Date().toLocaleTimeString('zh-TW')}] ${msg}`); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

// ===== Guerrilla Mail API =====
class TempMail {
    constructor() {
        this.sidToken = null;
        this.email = null;
    }

    async init() {
        const res = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address&ip=127.0.0.1&agent=Mozilla');
        const data = await res.json();
        this.sidToken = data.sid_token;
        this.email = data.email_addr;
        return this.email;
    }

    async checkMessages() {
        const res = await fetch(`https://api.guerrillamail.com/ajax.php?f=check_email&seq=0&sid_token=${this.sidToken}`);
        const data = await res.json();
        return data.list || [];
    }

    async readMessage(mailId) {
        const res = await fetch(`https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${mailId}&sid_token=${this.sidToken}`);
        return await res.json();
    }

    async waitForNintendoMail(maxWaitSec = 150) {
        log(`⏳ 等待驗證信...`);
        const start = Date.now();
        while (Date.now() - start < maxWaitSec * 1000) {
            try {
                const msgs = await this.checkMessages();
                const found = msgs.find(m => {
                    const from = (m.mail_from || '').toLowerCase();
                    const subject = (m.mail_subject || '').toLowerCase();
                    return from.includes('nintendo') || from.includes('accounts') || 
                           subject.includes('驗證') || subject.includes('verification') || subject.includes('verify');
                });
                if (found) {
                    log(`📧 收到驗證信！ Subject: ${found.mail_subject}`);
                    const detail = await this.readMessage(found.mail_id);
                    return detail;
                }
            } catch (e) {}
            const elapsed = Math.floor((Date.now() - start) / 1000);
            process.stdout.write(`\r   輪詢中... ${elapsed}s / ${maxWaitSec}s`);
            await sleep(3000);
        }
        throw new Error(`超過 ${maxWaitSec} 秒未收到驗證信`);
    }
}

function extractCode(body) {
    if (!body) return null;
    // 清理 HTML
    const text = body.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
    const patterns = [
        /驗證碼[」」：:\s]*(\d{4,6})/,
        /verification\s*code[:\s]*(\d{4,6})/i,
        /code\s*(?:is|:)\s*(\d{4,6})/i,
        /(\d{4,6})/,
    ];
    for (const p of patterns) {
        const m = text.match(p);
        if (m) return m[1];
    }
    return null;
}

// ===== 主流程 =====
async function main() {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   🌱 Pikmin Bloom 邀請碼半自動化工具     ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`  📌 邀請碼: ${CONFIG.referralCode}`);
    console.log(`  🔒 密碼:   ${CONFIG.password}`);
    console.log('');

    // 1. 取得臨時 Email
    log('📧 [Step 1] 取得臨時 Email...');
    const mail = new TempMail();
    const email = await mail.init();
    log(`✅ 臨時信箱: ${email}`);

    // 2. 啟動瀏覽器
    log('🌐 [Step 2] 啟動瀏覽器...');
    const browser = await chromium.launch({
        headless: !CONFIG.headed,
        slowMo: CONFIG.slowMo,
        args: ['--start-maximized'],
    });
    const context = await browser.newContext({
        locale: 'zh-TW',
        timezoneId: 'Asia/Taipei',
        viewport: { width: 500, height: 900 },
    });
    const page = await context.newPage();

    try {
        // 3. 開啟 Nintendo 註冊
        log('📝 [Step 3] 開啟 Nintendo 帳號註冊...');
        await page.goto('https://accounts.nintendo.com/register', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForLoadState('networkidle').catch(() => {});
        await sleep(3000);

        await page.screenshot({ path: 'debug_01_page.png' });
        log('  📸 截圖: debug_01_page.png');

        // 填寫表單
        log('  📧 填寫 Email...');
        await tryFill(page, [
            'input[name="email"]', 'input[type="email"]', '#email',
            'input[autocomplete="email"]', 'input[placeholder*="郵件"]', 'input[placeholder*="mail"]',
        ], email);

        log('  👤 填寫暱稱...');
        await tryFill(page, [
            'input[name="nickname"]', '#nickname', 'input[placeholder*="暱稱"]',
        ], email.split('@')[0].substring(0, 10));

        log('  🔒 填寫密碼...');
        const pwInputs = page.locator('input[type="password"]');
        const pwCount = await pwInputs.count();
        if (pwCount >= 1) await pwInputs.nth(0).fill(CONFIG.password);
        if (pwCount >= 2) await pwInputs.nth(1).fill(CONFIG.password);

        log('  📅 填寫出生日期...');
        await trySelect(page, ['select[name="birthYear"]', '#birthYear'], CONFIG.birthYear);
        await trySelect(page, ['select[name="birthMonth"]', '#birthMonth'], CONFIG.birthMonth);
        await trySelect(page, ['select[name="birthDay"]', '#birthDay'], CONFIG.birthDay);

        log('  ⚧ 設定性別...');
        await trySelect(page, ['select[name="gender"]', '#gender'], '', ['不選擇', 'Prefer not to say']);

        log('  🌏 選擇國家...');
        await trySelect(page, ['select[name="country"]', '#country'], 'TW', ['台灣', 'Taiwan']);

        log('  🕐 選擇時區...');
        await trySelect(page, ['select[name="timezone"]', '#timezone'], 'Asia/Taipei', ['(UTC+08:00) Asia/Taipei']);

        log('  ☑️ 勾選同意條款...');
        const cbs = page.locator('input[type="checkbox"]');
        for (let i = 0; i < await cbs.count(); i++) {
            try { if (!(await cbs.nth(i).isChecked())) await cbs.nth(i).check(); } catch {}
        }

        await page.screenshot({ path: 'debug_02_filled.png' });
        log('  📸 截圖: debug_02_filled.png');

        log('');
        log('✋ 表單已自動填寫完畢！請檢查瀏覽器中的內容。');
        await prompt('   按 Enter 送出表單 >');

        // 點擊建立
        log('  🚀 點擊建立...');
        const clicked = await tryClick(page, [
            'button:has-text("建立")', 'button[type="submit"]',
            'input[type="submit"]', 'button:has-text("Create")',
        ]);
        if (!clicked) {
            log('  ⚠️ 找不到按鈕，請手動點擊');
            await prompt('   完成後按 Enter >');
        }

        await sleep(5000);
        await page.screenshot({ path: 'debug_03_submitted.png' });

        // 4. 等待驗證碼
        log('📬 [Step 4] 等待驗證碼...');
        let code = null;
        try {
            const mailDetail = await mail.waitForNintendoMail(150);
            const body = mailDetail.mail_body || mailDetail.mail_text || '';
            code = extractCode(body);
            if (code) {
                log(`\n✅ 驗證碼: ${code}`);
            } else {
                log('\n⚠️ 無法自動提取驗證碼');
                log('   信件內容:');
                log('   ' + body.replace(/<[^>]+>/g, ' ').substring(0, 400));
                code = await prompt('   請手動輸入驗證碼 >');
            }
        } catch (e) {
            log(`\n⚠️ ${e.message}`);
            code = await prompt('   請手動取得驗證碼並輸入 >');
        }

        // 5. 填入驗證碼
        if (code) {
            log('🔑 [Step 5] 填入驗證碼...');
            const filled = await tryFill(page, [
                'input[name="code"]', 'input[name="verificationCode"]',
                'input[maxlength="6"]', 'input[maxlength="4"]',
                'input[placeholder*="驗證"]', 'input[type="text"]',
            ], code);

            if (filled) {
                await tryClick(page, [
                    'button:has-text("送出")', 'button:has-text("Submit")',
                    'button:has-text("確認")', 'button:has-text("Verify")',
                    'button[type="submit"]',
                ]);
                await sleep(5000);
                log('   ✅ 驗證碼已送出！');
            } else {
                log('   ⚠️ 請手動輸入驗證碼');
                await prompt('   完成後按 Enter >');
            }
        }

        await page.screenshot({ path: 'debug_04_done.png' });

        // 完成
        console.log('');
        console.log('╔══════════════════════════════════════════╗');
        console.log('║       ✅ Nintendo 帳號建立完成！          ║');
        console.log('╠══════════════════════════════════════════╣');
        console.log(`║  📧 Email:    ${email}`);
        console.log(`║  🔒 密碼:     ${CONFIG.password}`);
        console.log(`║  🎫 邀請碼:   ${CONFIG.referralCode}`);
        console.log('╚══════════════════════════════════════════╝');
        console.log('');
        console.log('👉 在 Pikmin Bloom App 手動操作：');
        console.log('   1. 用此帳號登入遊戲');
        console.log('   2. 完成初始設定');
        console.log(`   3. 設定 → 輸入邀請碼 → ${CONFIG.referralCode}`);

        await prompt('\n按 Enter 關閉 >');
    } catch (error) {
        console.error('❌ 錯誤:', error.message);
        await prompt('按 Enter 關閉 >');
    } finally {
        await browser.close();
    }
}

// ===== 工具函數 =====
async function tryFill(page, selectors, value) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.count() > 0 && await el.isVisible()) {
                await el.fill(value);
                return true;
            }
        } catch {}
    }
    return false;
}

async function trySelect(page, selectors, value, labels = []) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.count() > 0 && await el.isVisible()) {
                try { await el.selectOption(value); return true; } catch {}
                for (const label of labels) {
                    try { await el.selectOption({ label }); return true; } catch {}
                }
            }
        } catch {}
    }
    return false;
}

async function tryClick(page, selectors) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.count() > 0 && await el.isVisible()) {
                await el.click();
                return true;
            }
        } catch {}
    }
    return false;
}

main().catch(console.error);

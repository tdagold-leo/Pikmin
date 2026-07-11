import { chromium } from 'playwright';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function tryFill(page, selectors, value) {
    for (const sel of selectors) {
        try {
            const locator = page.locator(sel).first();
            if (await locator.count() > 0 && await locator.isVisible()) {
                await locator.focus();
                await locator.fill('');
                await locator.pressSequentially(value, { delay: 10 });
                return true;
            }
        } catch (e) {}
    }
    return false;
}

async function trySelect(page, selectors, value, labels = []) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.count() > 0 && await el.isVisible()) {
                try { await el.selectOption(value, { timeout: 1000 }); return true; } catch {}
                for (const lb of labels) {
                    try { await el.selectOption({ label: lb }, { timeout: 1000 }); return true; } catch {}
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

async function testMailTmFull() {
    console.log('Fetching domain...');
    let res = await fetch('https://api.mail.tm/domains');
    let domains = await res.json();
    let domain = domains['hydra:member'][0].domain;
    console.log('Using domain:', domain);

    const email = 'test' + Date.now() + '@' + domain;
    const password = 'password123';

    console.log('Creating account:', email);
    res = await fetch('https://api.mail.tm/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: email, password })
    });
    
    console.log('Getting token...');
    res = await fetch('https://api.mail.tm/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: email, password })
    });
    const tokenData = await res.json();
    const token = tokenData.token;

    console.log('Starting Playwright for Nintendo registration...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://accounts.nintendo.com/register', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2000);
    
    console.log('Filling form...');
    await tryFill(page, ['input[name="nickname"]', '#nickname'], email.split('@')[0].substring(0, 10));
    await tryFill(page, ['input[name="email"]', '#email', 'input[type="email"]'], email);
    await tryFill(page, ['input[name="password"]', '#password', 'input[type="password"]'], 'Nintendo123!');
    await tryFill(page, ['input[name="passwordConfirmation"]', 'input[name="password_confirmation"]'], 'Nintendo123!');
    
    const selects = page.locator('select');
    if (await selects.count() >= 6) {
        try { await selects.nth(0).selectOption('1990', { timeout: 1000 }); } catch {}
        try { await selects.nth(1).selectOption('6', { timeout: 1000 }); } catch { try { await selects.nth(1).selectOption('06', { timeout: 1000 }); } catch {} }
        try { await selects.nth(2).selectOption('15', { timeout: 1000 }); } catch {}
        try { await selects.nth(3).selectOption({ label: '不選擇' }, { timeout: 1000 }); } catch {
            try { await selects.nth(3).selectOption('not_specified', { timeout: 1000 }); } catch {}
        }
        try { await selects.nth(4).selectOption('TW', { timeout: 1000 }); } catch {}
        try { await selects.nth(5).selectOption('Asia/Taipei', { timeout: 1000 }); } catch {}
    } else {
        await trySelect(page, ['select[name="birthYear"]'], '1990');
        await trySelect(page, ['select[name="birthMonth"]'], '6', ['06']);
        await trySelect(page, ['select[name="birthDay"]'], '15');
        await trySelect(page, ['select[name="gender"]'], 'not_specified', ['不選擇', 'Prefer not to say']);
    }

    await page.evaluate(() => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => { if (!cb.checked) cb.click(); });
    }).catch(() => {});
    
    console.log('Submitting...');
    await tryClick(page, ['button:has-text("建立")', 'button[type="submit"]', 'button:has-text("Create")']);
    
    await sleep(5000);
    const errorText = await page.textContent('.error, .alert-danger, [role="alert"]').catch(() => '');
    if (errorText && errorText.trim()) {
        console.log(`Page error: ${errorText.trim().substring(0, 100)}`);
    } else {
        console.log('Form submitted successfully without visible errors. Polling for email...');
    }
    
    await browser.close();

    for (let i = 0; i < 6; i++) {
        await sleep(10000);
        console.log(`Polling attempt ${i+1}...`);
        res = await fetch('https://api.mail.tm/messages', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const msgs = await res.json();
        if (msgs['hydra:member'] && msgs['hydra:member'].length > 0) {
            console.log('Got messages!', msgs['hydra:member']);
            const msgId = msgs['hydra:member'][0].id;
            res = await fetch(`https://api.mail.tm/messages/${msgId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const fullMsg = await res.json();
            console.log('Full Message Subject:', fullMsg.subject);
            return;
        }
    }
    console.log('Did not receive email within 60 seconds.');
}

testMailTmFull();

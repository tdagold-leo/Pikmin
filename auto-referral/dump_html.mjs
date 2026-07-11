import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ locale: 'zh-TW', timezoneId: 'Asia/Taipei' });
    const page = await context.newPage();
    console.log('Navigating...');
    await page.goto('https://accounts.nintendo.com/register', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Dump the specific area if possible, or just the whole body
    const html = await page.content();
    fs.writeFileSync('nintendo_dump.html', html);
    console.log('HTML saved to nintendo_dump.html');
    await browser.close();
})();

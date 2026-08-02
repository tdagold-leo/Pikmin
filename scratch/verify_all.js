const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
const mainJs = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf-8');

const dom = new JSDOM(indexHtml, {
    runScripts: 'outside-only',
    url: 'https://tdagold-leo.github.io/Pikmin/'
});

const { window } = dom;
const { document } = window;

window.navigator.clipboard = {
    writeText: async (t) => { window._clipboard = t; return Promise.resolve(); }
};

const mockDb = {
    ref: (path) => ({
        on: (event, cb) => {
            if (path === 'postcards') {
                cb({
                    val: () => ({
                        'pc1': { name: '台北101', type: '常駐', coords: '25.0339, 121.5644', sgActivity: '群組A', sgLast: '2026/07/20' },
                        'pc2': { name: '象山', type: '常駐', coords: '25.0270, 121.5760', sgActivity: '群組A', sgLast: '2026/07/21' },
                        'pc3': { name: '中正紀念堂', type: '常駐', coords: '25.0350, 121.5190', sgActivity: '群組B', sgLast: '2026/07/22' }
                    })
                });
            } else if (path === 'mushrooms_v2') {
                cb({
                    val: () => ({
                        'm1': { name: '巨型蘑菇', coords: '25.0339, 121.5644', targetTime: Date.now() + 3600000 }
                    })
                });
            } else if (path === 'cloud_referrals_v2/public_invites') {
                cb({
                    val: () => ({
                        'pub1': { name: '公開好友', link: 'https://pikminbloom.onelink.me/pWSt/publink', createdAt: 12345 }
                    })
                });
            } else {
                cb({ val: () => null });
            }
        },
        push: (obj) => { window._pushed = obj; },
        update: (obj) => { window._updated = obj; },
        remove: () => { window._removed = true; },
        transaction: (fn) => { if (typeof fn === 'function') fn(0); },
        set: (v) => {}
    })
};

window.firebase = {
    initializeApp: () => ({ database: () => mockDb }),
    database: () => mockDb,
    apps: []
};
window.database = mockDb;

// Evaluate main.js
window.eval(mainJs);

console.log('--- Comprehensive System Verification ---');

// 1. Group claim test
console.log('Testing markGroupClaimedToday...');
window.markGroupClaimedToday('群組A');
console.log('[PASS] markGroupClaimedToday executed successfully');

// 2. Individual postcard claim test
console.log('Testing markPostcardClaimedToday...');
window.markPostcardClaimedToday('pc3');
console.log('[PASS] markPostcardClaimedToday executed successfully');

// 3. Tab switching test
console.log('Testing Tab Navigation...');
const navBtns = document.querySelectorAll('.nav-btn');
navBtns.forEach(btn => {
    btn.click();
});
console.log('[PASS] All navigation tab clicks executed without error');

// 4. Check View Cloud Elements
console.log('Testing Cloud Elements in DOM...');
const cloudView = document.getElementById('view-cloud');
if (!cloudView) throw new Error('#view-cloud not found');
const copyRefBtn = document.getElementById('cloud-copyRefCodeBtn');
if (!copyRefBtn) throw new Error('#cloud-copyRefCodeBtn not found');
console.log('[PASS] Cloud View elements verified');

console.log('ALL VERIFICATION CHECKS PASSED WITH ZERO ERRORS!');

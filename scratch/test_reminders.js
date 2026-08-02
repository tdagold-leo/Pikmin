const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html', 'utf-8');
const js = fs.readFileSync('c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js', 'utf-8');

const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'http://localhost/'
});

const { window } = dom;
window.firebase = {
    initializeApp: () => ({}),
    database: () => ({
        ref: (path) => ({
            on: (event, cb) => {
                if (event === 'value') {
                    if (path === 'postcards' || !path) {
                        cb({
                            val: () => ({
                                'test_1': {
                                    id: 'test_1',
                                    name: '常駐測試',
                                    type: '特殊金盆',
                                    tag: '缺 2024',
                                    sgType: '常駐',
                                    sgActivity: '活動A',
                                    sgCooldown: '30',
                                    sgLast: '' // should be claimable
                                },
                                'test_2': {
                                    id: 'test_2',
                                    name: '期間測試',
                                    type: '特殊金盆',
                                    tag: '活動B',
                                    sgType: '期間',
                                    sgActivity: '活動B',
                                    sgStart: '2024-01-01',
                                    sgEnd: '2099-12-31',
                                    sgCooldown: '30',
                                    sgLast: '2026-08-01'
                                }
                            })
                        });
                    } else {
                        cb({ val: () => ({}) });
                    }
                }
            },
            off: () => {},
            once: () => Promise.resolve({ val: () => ({}) }),
            push: () => Promise.resolve({ key: 'mock_key' }),
            update: () => Promise.resolve(),
            set: () => Promise.resolve(),
            remove: () => Promise.resolve(),
            transaction: () => Promise.resolve()
        })
    })
};

// Run main.js
window.eval(js);

// Trigger DOMContentLoaded
const event = window.document.createEvent('Event');
event.initEvent('DOMContentLoaded', true, true);
window.document.dispatchEvent(event);

console.log('--- Postcard Mode Grid HTML ---');
const pcEl = window.document.getElementById('postcard-container');
console.log(pcEl.innerHTML);

// Switch to goldbasin mode
window.eval("switchTab('goldbasin')");

console.log('--- Gold Basin Mode Grid HTML ---');
const gbEl = window.document.getElementById('goldbasin-container');
console.log(gbEl.innerHTML);

let success = true;
if (!pcEl.innerHTML.includes('❗缺') || !pcEl.innerHTML.includes('⚠️可拿')) {
    console.error('❌ Postcard mode missing reminder badges');
    success = false;
}
if (!gbEl.innerHTML.includes('❗缺') || !gbEl.innerHTML.includes('⚠️可拿')) {
    console.error('❌ Gold Basin mode missing reminder badges');
    success = false;
}

if (success) {
    console.log('🎉 ALL TESTS PASSED: Group notification reminders (❗缺 and ⚠️可拿) work in both modes!');
} else {
    process.exit(1);
}

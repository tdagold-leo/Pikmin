const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html><html><body><div id="postcard-list"></div></body></html>`;
const dom = new JSDOM(html, { runScripts: "outside-only" });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

// Mock test cards
const testItems = [
    {
        id: 'card-1',
        name: '01. 西雅圖水族館 - (珊瑚盆)',
        type: '特殊金盆',
        sgType: '期間',
        sgCooldown: '30',
        sgStart: '2026-07-01',
        sgEnd: '2026-09-07',
        tag: '30天拉一次'
    },
    {
        id: 'card-2',
        name: '02. 西雅圖水族館 - (禮物貼紙)',
        type: '特殊金盆',
        sgType: '期間',
        sgCooldown: '',
        sgStart: '2026-07-01',
        sgEnd: '2026-09-07',
        tag: '30天拉一次'
    },
    {
        id: 'card-3',
        name: '任天堂專賣店一號店',
        type: '特殊金盆',
        sgType: '常駐',
        tag: '常駐 - 30天一次'
    }
];

// Test logic
testItems.forEach(item => {
    let sgDateBadge = '';
    if (item.type === '特殊金盆') {
        const s = item.sgStart || '';
        const e = item.sgEnd || '';
        if (item.sgType === '期間' && (s || e)) {
            sgDateBadge += `<div class="period">📅 期間：${s || '未定'} ~ ${e || '未定'}</div>`;
        }

        let cdVal = item.sgCooldown;
        if (!cdVal && item.tag && (item.tag.includes('30天') || item.tag.includes('30 天') || item.tag.includes('一個月') || item.tag.includes('30 days'))) {
            cdVal = '30';
        }
        if (!cdVal && (item.sgType === '期間' || item.sgType === '常駐')) {
            cdVal = '30';
        }

        if (cdVal) {
            let hasStarted = true;
            if (item.sgType === '期間' && item.sgStart) {
                const startDate = new Date(item.sgStart + 'T00:00:00');
                const today = new Date();
                today.setHours(0,0,0,0);
                if (startDate > today) hasStarted = false;
            }

            if (!hasStarted) {
                sgDateBadge += `<div class="not-started">⏳ 尚未開始</div>`;
            } else if (!item.sgLast) {
                sgDateBadge += `<button class="claim-btn">🎁 今日領取</button>`;
            } else {
                sgDateBadge += `<button class="claimed-btn">✓ 今日已領</button>`;
            }
        }
    }

    console.log('Testing:', item.name);
    console.log('  Result HTML:', sgDateBadge);
    if (!sgDateBadge.includes('🎁 今日領取')) {
        throw new Error('Claim button missing for item: ' + item.name);
    }
});

console.log('=== ALL CARD BUTTON CHECKS PASSED! ===');

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

// Mock items in group
const mockPostcards = [
    { id: 'pc-1', name: '01. 西雅圖水族館', type: '特殊金盆', sgActivity: 'Seattle Aquarium 2026', sgCooldown: '30' },
    { id: 'pc-2', name: '02. 西雅圖水族館', type: '特殊金盆', sgActivity: 'Seattle Aquarium 2026', sgCooldown: '30' },
    { id: 'pc-3', name: '03. 西雅圖水族館', type: '特殊金盆', sgActivity: 'Seattle Aquarium 2026', sgCooldown: '30' },
    { id: 'pc-4', name: 'Nintendo Store', type: '特殊金盆', sgActivity: 'Nintendo SF', sgCooldown: '30' }
];

let globalPostcards = [...mockPostcards];

function markGroupClaimedToday(actName, e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    
    let personal = {};
    try {
        personal = JSON.parse(localStorage.getItem('pikmin_sgLast_map') || '{}');
    } catch(err){}

    let count = 0;
    globalPostcards.forEach(item => {
        const itemAct = (item.sgActivity || item.tag || '未分類').trim();
        if (itemAct === actName && item.type === '特殊金盆') {
            item.sgLast = todayStr;
            personal[item.id] = todayStr;
            count++;
        }
    });

    try {
        localStorage.setItem('pikmin_sgLast_map', JSON.stringify(personal));
    } catch(err){}

    return { count, todayStr };
}

console.log('--- Test 1: Before Claiming Group ---');
const now = new Date();
const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const seattleItems = globalPostcards.filter(p => p.sgActivity === 'Seattle Aquarium 2026');
let isAllClaimed = seattleItems.length > 0 && seattleItems.every(p => p.sgLast === todayStr);
console.log('Is all claimed before?:', isAllClaimed);
if (isAllClaimed) throw new Error('Should not be claimed yet');

console.log('--- Test 2: Trigger markGroupClaimedToday ---');
const res = markGroupClaimedToday('Seattle Aquarium 2026', { stopPropagation: () => console.log('Propagation stopped!') });
console.log('Claimed count:', res.count);
if (res.count !== 3) throw new Error('Expected 3 items to be claimed, got ' + res.count);

console.log('--- Test 3: Check after group claiming ---');
isAllClaimed = seattleItems.length > 0 && seattleItems.every(p => p.sgLast === todayStr);
console.log('Is all claimed after?:', isAllClaimed);
if (!isAllClaimed) throw new Error('All items should now be claimed today');

const otherItem = globalPostcards.find(p => p.sgActivity === 'Nintendo SF');
console.log('Other group item sgLast:', otherItem.sgLast);
if (otherItem.sgLast) throw new Error('Other group items should not be affected');

const savedStorage = JSON.parse(localStorage.getItem('pikmin_sgLast_map'));
console.log('Saved localStorage map:', savedStorage);
if (savedStorage['pc-1'] !== todayStr || savedStorage['pc-2'] !== todayStr || savedStorage['pc-3'] !== todayStr) {
    throw new Error('LocalStorage not properly updated for all cards in group');
}

console.log('=== ALL GROUP CLAIM TESTS PASSED! ===');

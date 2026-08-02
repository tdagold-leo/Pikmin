const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf-8');

// Set up mock DOM and browser globals
const elements = {};
global.window = global;
global.window.addEventListener = () => {};
global.window.scrollTo = () => {};
global.document = {
    addEventListener: () => {},
    getElementById: (id) => {
        if (!elements[id]) {
            elements[id] = {
                id,
                value: '',
                innerText: '',
                style: {},
                classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false },
                addEventListener: () => {},
                removeEventListener: () => {},
                appendChild: () => {},
                setAttribute: () => {},
                innerHTML: ''
            };
        }
        return elements[id];
    },
    querySelectorAll: () => [],
    createElement: (tag) => ({
        tagName: tag,
        style: {},
        classList: { add: ()=>{}, remove: ()=>{} },
        addEventListener: () => {},
        appendChild: () => {},
        innerHTML: ''
    }),
    head: { appendChild: ()=>{} },
    body: { style: {} },
    readyState: 'complete'
};

const storage = {};
global.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = v; }
};

global.firebase = {
    initializeApp: () => ({}),
    apps: [{}],
    database: () => ({
        ref: () => ({
            on: () => {},
            set: () => {},
            update: () => {},
            push: () => ({ key: 'test' }),
            transaction: () => {}
        })
    })
};
global.google = { maps: { marker: {} } };

// Evaluate main.js
eval(js);

console.log('--- Test 1: setTodayDate ---');
global.setTodayDate('post-sg-last');
const todayVal = global.document.getElementById('post-sg-last').value;
console.log('Today date set to:', todayVal);
const now = new Date();
const expected = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
if (todayVal !== expected) throw new Error('setTodayDate failed, got ' + todayVal);
console.log('Test 1 PASS!');

console.log('--- Test 2: markPostcardClaimedToday ---');
global.postcardList = [
    { id: 'item-1', name: '測試特殊金盆', type: '特殊金盆', sgType: '期間', sgStart: '2026-07-01', sgEnd: '2026-09-01', sgCooldown: '30' }
];
global.markPostcardClaimedToday('item-1');
console.log('Item sgLast:', global.postcardList[0].sgLast);
const savedMap = JSON.parse(global.localStorage.getItem('pikmin_sgLast_map') || '{}');
console.log('Saved in localStorage:', savedMap);
if (savedMap['item-1'] !== expected) throw new Error('markPostcardClaimedToday failed to save to localStorage');
console.log('Test 2 PASS!');

console.log('--- Test 3: updateView rendering ---');
global.currentMode = 'goldbasin';
global.updateView();
console.log('Test 3 PASS!');

console.log('\n=== ALL USER FLOW TESTS PASSED SUCCESSFULLY! ===');

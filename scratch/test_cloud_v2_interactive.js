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

// Provide mock firebase and clipboard
window.navigator.clipboard = {
    writeText: async (t) => { window._clipboard = t; return Promise.resolve(); }
};
const mockDb = {
    ref: (path) => ({
        on: (event, cb) => {
            window._dbOnCb = cb;
            cb({ val: () => ({ 'pub1': { name: '公開好友', link: 'https://pikminbloom.onelink.me/pWSt/publink', createdAt: 12345 } }) });
        },
        push: (obj) => {
            window._pushedObj = obj;
        },
        update: (obj) => {
            window._updatedObj = obj;
        },
        remove: () => {
            window._removed = true;
        },
        transaction: (fn) => {
            if (typeof fn === 'function') fn(0);
        },
        set: (val) => {}
    })
};
window.firebase = {
    initializeApp: () => ({ database: () => mockDb }),
    database: () => mockDb,
    apps: []
};
window.database = mockDb;

// Evaluate main.js in the window context
window.eval(mainJs);

console.log('--- Testing Cloud V2 Interactive Logic ---');

// Test 1: Copy Referral Code
const refInput = document.getElementById('cloud-referralCode');
const copyRefBtn = document.getElementById('cloud-copyRefCodeBtn');
refInput.value = 'TESTREFCODE';
copyRefBtn.click();
if (window._clipboard !== 'TESTREFCODE') throw new Error(`Copy Ref Code failed, clipboard: ${window._clipboard}`);
console.log('[PASS] Copy Referral Code worked');

// Test 2: Copy Password
const pwdInput = document.getElementById('cloud-password');
const copyPwdBtn = document.getElementById('cloud-copyPwdBtn');
copyPwdBtn.click();
if (window._clipboard !== 'Pikmin123!@') throw new Error(`Copy Password failed, clipboard: ${window._clipboard}`);
console.log('[PASS] Copy Password worked');

// Test 3: Invite Link sync with Open Pikmin button
const inviteLinkInput = document.getElementById('cloud-inviteLink');
const openPikminBtn = document.getElementById('cloud-openPikminBtn');
inviteLinkInput.value = 'https://pikminbloom.onelink.me/pWSt/customlink';
inviteLinkInput.dispatchEvent(new window.Event('input'));
if (openPikminBtn.href !== 'https://pikminbloom.onelink.me/pWSt/customlink') throw new Error(`Open button href mismatch: ${openPikminBtn.href}`);
console.log('[PASS] Invite Link input synced with Open Pikmin button');

// Test 4: Save to Local Invites
const inviteNameInput = document.getElementById('cloud-inviteName');
const saveInviteBtn = document.getElementById('cloud-saveInviteBtn');
const isPublicCheckbox = document.getElementById('cloud-isPublic');
const savedLocalList = document.getElementById('cloud-savedLocalLinksList');

isPublicCheckbox.checked = false;
inviteNameInput.value = '我的私房號';
inviteLinkInput.value = 'https://pikminbloom.onelink.me/pWSt/privatelink';
saveInviteBtn.click();

if (!savedLocalList.innerHTML.includes('我的私房號')) {
    throw new Error('Local saved links list does not contain newly saved link');
}
console.log('[PASS] Save to Local Invites and rendering worked');

// Test 5: Check Public List from Firebase Mock
const savedPublicList = document.getElementById('cloud-savedPublicLinksList');
if (!savedPublicList.innerHTML.includes('公開好友')) {
    throw new Error('Public list did not render Firebase mock data');
}
console.log('[PASS] Firebase Public List rendered successfully');

console.log('All Cloud V2 Interactive Tests Passed Successfully!');

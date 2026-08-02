const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html', 'utf-8');
const js = fs.readFileSync('c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\js\\main.js', 'utf-8');

console.log('--- 1. Testing Syntax & Execution in JSDOM ---');

const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost/'
});

const { window } = dom;

// Mock Firebase
window.firebase = {
    initializeApp: () => ({}),
    database: () => ({
        ref: () => ({
            on: () => {},
            off: () => {},
            once: () => Promise.resolve({ val: () => ({}) }),
            push: () => Promise.resolve({ key: 'mock_key' }),
            update: () => Promise.resolve(),
            set: () => Promise.resolve(),
            remove: () => Promise.resolve()
        })
    })
};
window.database = window.firebase.database();

// Mock navigator.clipboard
window.navigator.clipboard = {
    writeText: (text) => Promise.resolve()
};

let errors = [];
window.addEventListener('error', (e) => {
    errors.push(e.error || e.message);
});

try {
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = js;
    window.document.body.appendChild(scriptEl);
    console.log('✅ JS executed without uncaught syntax or initialization errors.');
} catch (e) {
    console.error('❌ JS execution error:', e);
}

if (errors.length > 0) {
    console.error('❌ Window Errors:', errors);
} else {
    console.log('✅ 0 runtime errors detected.');
}

console.log('--- 2. Checking Cloud SPA Elements ---');
const startBtn = window.document.getElementById('cloud-startBtn');
const openPikminBtn = window.document.getElementById('cloud-openPikminBtn');
const emailBox = window.document.getElementById('cloud-emailBox');
const copyEmailBtn = window.document.getElementById('cloud-copyEmailBtn');
const pwdInput = window.document.getElementById('cloud-password');
const copyPwdBtn = window.document.getElementById('cloud-copyPwdBtn');
const codeBox = window.document.getElementById('cloud-codeBox');
const copyCodeBtn = window.document.getElementById('cloud-copyCodeBtn');
const inviteName = window.document.getElementById('cloud-inviteName');
const inviteLink = window.document.getElementById('cloud-inviteLink');
const isPublic = window.document.getElementById('cloud-isPublic');
const saveInviteBtn = window.document.getElementById('cloud-saveInviteBtn');
const savedLocalLinksList = window.document.getElementById('cloud-savedLocalLinksList');
const savedPublicLinksList = window.document.getElementById('cloud-savedPublicLinksList');

console.log('cloud-startBtn exists:', !!startBtn);
console.log('cloud-openPikminBtn exists:', !!openPikminBtn);
console.log('cloud-emailBox exists:', !!emailBox);
console.log('cloud-copyEmailBtn exists:', !!copyEmailBtn);
console.log('cloud-password exists:', !!pwdInput, 'value:', pwdInput ? pwdInput.value : '');
console.log('cloud-copyPwdBtn exists:', !!copyPwdBtn);
console.log('cloud-codeBox exists:', !!codeBox);
console.log('cloud-copyCodeBtn exists:', !!copyCodeBtn);
console.log('cloud-inviteName exists:', !!inviteName);
console.log('cloud-inviteLink exists:', !!inviteLink);
console.log('cloud-isPublic exists:', !!isPublic);
console.log('cloud-saveInviteBtn exists:', !!saveInviteBtn);
console.log('cloud-savedLocalLinksList exists:', !!savedLocalLinksList);
console.log('cloud-savedPublicLinksList exists:', !!savedPublicLinksList);

console.log('--- 3. Testing Local Invite Save & Render ---');
inviteName.value = '測試帳號';
inviteLink.value = 'https://pikminbloom.onelink.me/test/123';
isPublic.checked = false;
saveInviteBtn.click();

console.log('Saved local links content:', savedLocalLinksList.innerHTML);
if (savedLocalLinksList.innerHTML.includes('測試帳號')) {
    console.log('✅ Local invite saved and rendered properly!');
} else {
    console.error('❌ Local invite failed to render.');
}

console.log('--- All Verification Complete ---');

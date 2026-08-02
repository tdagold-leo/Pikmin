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
        ref: () => ({
            on: () => {},
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

// Run js in window context
window.eval(js);

const inviteName = window.document.getElementById('cloud-inviteName');
const inviteLink = window.document.getElementById('cloud-inviteLink');
const isPublic = window.document.getElementById('cloud-isPublic');
const saveInviteBtn = window.document.getElementById('cloud-saveInviteBtn');
const savedLocalLinksList = window.document.getElementById('cloud-savedLocalLinksList');

inviteName.value = '測試小明';
inviteLink.value = 'https://pikminbloom.onelink.me/test/123';
isPublic.checked = false;

saveInviteBtn.click();

console.log('innerHTML after click:');
console.log(savedLocalLinksList.innerHTML);
